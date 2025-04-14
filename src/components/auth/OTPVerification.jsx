import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function OTPVerification({ email, onVerify, onResend, userType }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Handle input in OTP fields
  const handleChange = (index, value) => {
    if (value.length > 1) {
      return; // Don't allow multiple characters in a single input
    }

    // Update the OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input if value entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle backspace key to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otpValue);
    } catch (error) {
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle OTP resend
  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      toast.success("OTP resent to your email");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verification
        </h2>
        <p className="text-gray-600">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* OTP input fields */}
      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            className="w-10 h-12 border-2 rounded-md text-center text-xl font-semibold focus:border-primary focus:outline-none"
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </motion.button>

        <div className="text-center">
          <p className="text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary font-medium hover:text-primary-dark transition-colors disabled:opacity-70"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          The verification code will expire in 10 minutes.
        </p>
      </div>
    </motion.div>
  );
}
