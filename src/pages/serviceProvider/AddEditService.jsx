"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Upload, X, File, ImageIcon, Info, ChevronLeft, AlertTriangle, Save, Loader2 } from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import toast from "react-hot-toast"

export function AddEditService() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    category: "",
    pdf: null,
    image: null,
  })

  const [errors, setErrors] = useState({})
  const [pdfPreview, setPdfPreview] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const pdfInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [pdfDragging, setPdfDragging] = useState(false)
  const [imageDragging, setImageDragging] = useState(false)

  const categories = [
    "Cleaning",
    "Maintenance",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Painting",
    "Gardening",
    "Home Improvement",
    "Professional Services",
    "Education",
    "Health & Wellness",
    "Beauty",
    "Other",
  ]

  // For edit mode, fetch existing service data
  useEffect(() => {
    if (isEditMode) {
      const fetchServiceData = async () => {
        try {
          // In a real application, this would be an API call
          // const response = await api.get(`/services/${id}`)
          // const serviceData = response.data

          // Mock data for demonstration
          const serviceData = {
            serviceName: "Home Cleaning",
            description:
              "Professional home cleaning services for a sparkling clean living space. We use eco-friendly cleaning products and follow a detailed checklist to ensure your home is spotless.",
            price: "50",
            category: "Cleaning",
            pdfPath: "home_cleaning_details.pdf",
            imagePath:
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          }

          setFormData({
            serviceName: serviceData.serviceName,
            description: serviceData.description,
            price: serviceData.price,
            category: serviceData.category,
            pdf: null, // Existing files will be kept if no new file is uploaded
            image: null,
          })

          setPdfPreview(serviceData.pdfPath)
          setImagePreview(serviceData.imagePath)
        } catch (error) {
          console.error("Failed to fetch service data:", error)
          toast.error("Failed to load service data")
          navigate("/provider/services")
        }
      }

      fetchServiceData()
    }
  }, [id, isEditMode, navigate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!isEditMode && !formData.pdf && !pdfPreview) {
      newErrors.pdf = "Service document (PDF) is required"
    }

    if (!isEditMode && !formData.image && !imagePreview) {
      newErrors.image = "Service image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    handlePdfFile(file)
  }

  const handlePdfDrop = (e) => {
    e.preventDefault()
    setPdfDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handlePdfFile(file)
    }
  }

  const handlePdfFile = (file) => {
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("PDF file size should be less than 10MB")
        return
      }

      setFormData({ ...formData, pdf: file })
      setPdfPreview(file.name)

      if (errors.pdf) {
        setErrors({ ...errors, pdf: undefined })
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    handleImageFile(file)
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    setImageDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleImageFile(file)
    }
  }

  const handleImageFile = (file) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image file size should be less than 5MB")
        return
      }

      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))

      if (errors.image) {
        setErrors({ ...errors, image: undefined })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Create form data for multipart/form-data submission
      const submitData = new FormData()
      submitData.append("serviceName", formData.serviceName)
      submitData.append("description", formData.description)
      submitData.append("price", formData.price)
      submitData.append("category", formData.category)

      if (formData.pdf) {
        submitData.append("pdf", formData.pdf)
      }

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      let response
      if (isEditMode) {
        // In a real application, this would be an API call
        // response = await api.put(`/services/${id}`, submitData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // })

        // Mock response
        response = { status: 200 }

        toast.success("Service updated successfully")
      } else {
        // In a real application, this would be an API call
        // response = await api.post("/services", submitData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // })

        // Mock response
        response = { status: 201 }

        toast.success("Service submitted for approval")
      }

      navigate("/provider/services")
    } catch (error) {
      console.error("Failed to submit service:", error)
      toast.error(error.response?.data?.message || "Failed to submit service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearPdf = () => {
    setFormData({ ...formData, pdf: null })
    setPdfPreview("")
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ""
    }
  }

  const clearImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview("")
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  return (
    <ServiceProviderLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/provider/services")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Services
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mt-4">{isEditMode ? "Edit Service" : "Add New Service"}</h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update your service information below"
              : "Fill in the details below to add a new service for approval"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center text-green-800">
              <Info size={20} className="mr-2 text-green-600" />
              <p className="text-sm">
                {isEditMode
                  ? "Your changes will be reviewed before being published"
                  : "All new services require approval before being listed"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.serviceName ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Professional Home Cleaning"
              />
              {errors.serviceName && <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.description ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder="Provide a detailed description of your service..."
              ></textarea>
              {errors.description ? (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 20 characters. Provide detailed information about what your service includes.
                </p>
              )}
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.price ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.category ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Document (PDF) <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 ${
                  pdfDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
                } ${errors.pdf ? "border-red-300 bg-red-50" : ""} transition-colors`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setPdfDragging(true)
                }}
                onDragLeave={() => setPdfDragging(false)}
                onDrop={handlePdfDrop}
              >
                <input type="file" accept=".pdf" onChange={handlePdfChange} className="hidden" ref={pdfInputRef} />

                {pdfPreview ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <File className="w-10 h-10 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{pdfPreview}</p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearPdf}
                      className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={() => pdfInputRef.current?.click()}
                          className="text-green-600 font-medium hover:text-green-700"
                        >
                          Click to upload
                        </button>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.pdf && <p className="mt-1 text-sm text-red-600">{errors.pdf}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Image <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 ${
                  imageDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
                } ${errors.image ? "border-red-300 bg-red-50" : ""} transition-colors`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setImageDragging(true)
                }}
                onDragLeave={() => setImageDragging(false)}
                onDrop={handleImageDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={imageInputRef}
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3 w-full max-w-xs mx-auto">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Service preview"
                        className="rounded-lg h-48 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition-opacity"
                      >
                        <X size={16} className="text-gray-700" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Click the image or button to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="text-green-600 font-medium hover:text-green-700"
                        >
                          Click to upload
                        </button>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            {/* Submission Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800">
                    {isEditMode
                      ? "Your service will be reviewed again after these changes are submitted."
                      : "Your service will be reviewed by our team before it's published. This typically takes 1-2 business days."}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/provider/services")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-4"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {isEditMode ? "Update Service" : "Submit for Approval"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ServiceProviderLayout>
  )
}