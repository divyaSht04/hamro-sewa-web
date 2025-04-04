import React, { useState, useEffect } from 'react';
import { getLoyaltyProgress, fixLoyaltyTracking } from '../services/loyaltyService';
import { Card, Typography, Progress, Tag, Divider, Alert, Button, Tooltip, notification } from 'antd';
import { SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Component to display a customer's loyalty status with a service provider
 * 
 * @param {Object} props - Component props
 * @param {number} props.customerId - The customer ID
 * @param {number} props.serviceProviderId - The service provider ID
 * @param {string} props.providerName - The service provider name
 * @returns {JSX.Element} - Rendered component
 */
const LoyaltyStatusCard = ({ customerId, serviceProviderId, providerName }) => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoyaltyData = async () => {
    setLoading(true);
    try {
      const data = await getLoyaltyProgress(customerId, serviceProviderId);
      
      // Additional processing to ensure discount eligibility is correctly determined
      if (!data.discountEligible && !data.eligibleForDiscount && data.completedBookings >= 4) {
        data.discountEligible = true;
        data.eligibleForDiscount = true;
        console.log('LoyaltyStatusCard: Setting discount eligibility based on completed bookings count');
      }
      
      setLoyaltyData(data);
      setError(null);
    } catch (err) {
      setError('Unable to load loyalty information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFixLoyalty = async () => {
    try {
      setLoading(true);
      await fixLoyaltyTracking(customerId);
      await fetchLoyaltyData(); // Refresh data after fixing
      notification.success({
        message: 'Loyalty Status Updated',
        description: 'Your loyalty status has been recalculated based on your booking history.'
      });
    } catch (err) {
      setError('Failed to update loyalty status');
      notification.error({
        message: 'Update Failed',
        description: 'Could not update loyalty status. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId && serviceProviderId) {
      fetchLoyaltyData();
    }
  }, [customerId, serviceProviderId]);

  if (loading) {
    return <Card loading />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!loyaltyData) {
    return null;
  }

  const { 
    completedBookings, 
    bookingsNeededForDiscount, 
    eligibleForDiscount,
    discountPercentage 
  } = loyaltyData;

  // Calculate progress percentage (0 to 100%)
  const progressPercentage = Math.min(completedBookings * 25, 100); // 4 bookings = 100%

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Loyalty Program</Title>
          <Tooltip title="Refresh loyalty status">
            <Button 
              icon={<SyncOutlined />} 
              size="small" 
              onClick={fetchLoyaltyData} 
              loading={loading}
            />
          </Tooltip>
        </div>
      }
      bordered={true}
      style={{ marginBottom: 20 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Your Loyalty Status with {providerName}</Text>
      </div>

      {eligibleForDiscount ? (
        <Alert
          message="Congratulations!"
          description={
            <span>
              You qualify for a {discountPercentage}% discount on this booking! <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>
                <small>Discount will be automatically applied when you book.</small>
              </div>
            </span>
          }
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          <div style={{ marginBottom: 8 }}>
            <Text>{`Completed bookings: ${completedBookings}`}</Text>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text>{`Bookings needed for ${discountPercentage}% discount: ${bookingsNeededForDiscount} more`}</Text>
          </div>
          <Progress 
            percent={progressPercentage} 
            strokeColor="#1890ff"
            status="active"
          />
        </>
      )}

      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">
          Book 4 services with the same provider and get 20% off your 5th booking!
        </Text>
        <Tooltip title="Fix loyalty tracking if your discount isn't being applied correctly">
          <Button 
            type="link" 
            size="small"
            onClick={handleFixLoyalty}
            loading={loading}
          >
            Fix issues
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default LoyaltyStatusCard;
