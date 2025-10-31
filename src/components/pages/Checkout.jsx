import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Order Notes
    orderNotes: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const cartData = await cartService.getCart();
      
      if (!cartData || cartData.items.length === 0) {
        navigate("/cart");
        return;
      }
      
      setCart(cartData);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      // Validate shipping information
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
      if (!formData.phone.trim()) errors.phone = "Phone number is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
    }
    
    if (stepNumber === 2) {
      // Validate payment information
      if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
      if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) errors.cvv = "CVV is required";
      if (!formData.cardName.trim()) errors.cardName = "Cardholder name is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;
    
    try {
      setSubmitting(true);
      
      const orderData = {
        items: cart.items,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.slice(-4), // Only store last 4 digits
          cardName: formData.cardName
        },
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        orderNotes: formData.orderNotes
      };
      
      const order = await orderService.createOrder(orderData);
      
      // Clear the cart
      await cartService.clearCart();
      
      // Dispatch event for header to update cart count
      window.dispatchEvent(new Event("cartUpdated"));
      
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
      
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-800">Checkout</h1>
          <p className="text-secondary-600 mt-2">Complete your order securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? "bg-primary-600 text-white" : "bg-secondary-200 text-secondary-600"
            }`}>
              1
            </div>
            <div className="w-16 h-1 bg-secondary-200">
              <div className={`h-full transition-all duration-300 ${
                step >= 2 ? "bg-primary-600 w-full" : "bg-transparent w-0"
              }`} />
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? "bg-primary-600 text-white" : "bg-secondary-200 text-secondary-600"
            }`}>
              2
            </div>
            <div className="w-16 h-1 bg-secondary-200">
              <div className={`h-full transition-all duration-300 ${
                step >= 3 ? "bg-primary-600 w-full" : "bg-transparent w-0"
              }`} />
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? "bg-primary-600 text-white" : "bg-secondary-200 text-secondary-600"
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="MapPin" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-secondary-800">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={formErrors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={formErrors.lastName}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={formErrors.phone}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={formErrors.address}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={formErrors.city}
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={formErrors.state}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={formErrors.zipCode}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleNextStep} icon="ArrowRight" iconPosition="right">
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="CreditCard" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-secondary-800">
                    Payment Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    error={formErrors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      error={formErrors.expiryDate}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      error={formErrors.cvv}
                      placeholder="123"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Cardholder Name"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    error={formErrors.cardName}
                    required
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep} icon="ArrowLeft">
                    Back to Shipping
                  </Button>
                  <Button onClick={handleNextStep} icon="ArrowRight" iconPosition="right">
                    Review Order
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Eye" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-secondary-800">
                    Review Your Order
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} 
                             className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-secondary-800">{item.name}</h4>
                            <p className="text-sm text-secondary-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium text-secondary-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-2">Shipping Address</h3>
                    <div className="text-secondary-600">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.country}</p>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <Input
                      label="Order Notes (Optional)"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep} icon="ArrowLeft">
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handleSubmitOrder}
                    loading={submitting}
                    icon="CheckCircle"
                    size="lg"
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${cart.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-medium">${cart.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="gradient-text">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 space-y-3 text-sm text-secondary-600">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" size={16} className="text-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CreditCard" size={16} className="text-green-500" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="RotateCcw" size={16} className="text-green-500" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;