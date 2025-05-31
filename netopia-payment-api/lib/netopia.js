
const xml2js = require('xml2js');
const NetopiaEncryption = require('./encrypt');

class NetopiaPayment {
  constructor(signature, publicKey, privateKey, testMode = true) {
    this.signature = signature;
    this.testMode = testMode;
    this.encryption = new NetopiaEncryption(publicKey, privateKey);
    this.baseUrl = testMode 
      ? 'https://sandboxsecure.mobilpay.ro'
      : 'https://secure.mobilpay.ro';
  }

  generateOrderId(originalOrderId) {
    return `ORDER_${originalOrderId}_${Date.now()}`;
  }

  createPaymentXML(orderData) {
    const {
      orderId,
      amount,
      currency = 'RON',
      customerEmail,
      customerName,
      description,
      returnUrl,
      confirmUrl
    } = orderData;

    const netopiaOrderId = this.generateOrderId(orderId);
    const timestamp = Date.now();

    // Split customer name
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0] || customerName;
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const paymentData = {
      order: {
        $: {
          id: netopiaOrderId,
          timestamp: timestamp,
          type: 'card'
        },
        signature: this.signature,
        url: {
          return: returnUrl,
          confirm: confirmUrl
        },
        invoice: {
          $: {
            currency: currency,
            amount: amount
          },
          details: description,
          contact_info: {
            billing: {
              $: { type: 'person' },
              first_name: firstName,
              last_name: lastName,
              address: 'Address',
              email: customerEmail,
              mobile_phone: '0000000000'
            },
            shipping: {
              $: { type: 'person' },
              first_name: firstName,
              last_name: lastName,
              address: 'Address',
              email: customerEmail,
              mobile_phone: '0000000000'
            }
          }
        },
        ipn_cipher: 'aes-256-cbc'
      }
    };

    const builder = new xml2js.Builder({
      rootName: 'order',
      xmldec: { version: '1.0', encoding: 'utf-8' }
    });

    return {
      xml: builder.buildObject(paymentData.order),
      netopiaOrderId
    };
  }

  createPaymentRequest(orderData) {
    try {
      const { xml, netopiaOrderId } = this.createPaymentXML(orderData);
      
      console.log('Generated XML:', xml);
      
      // Encrypt the XML data
      const encryptedData = this.encryption.encrypt(xml);
      
      return {
        success: true,
        paymentUrl: this.baseUrl,
        formData: encryptedData,
        netopiaOrderId,
        signature: this.signature
      };
    } catch (error) {
      console.error('Error creating payment request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  parseIPNResponse(encryptedData) {
    try {
      const decryptedXML = this.encryption.decrypt(encryptedData);
      
      return new Promise((resolve, reject) => {
        xml2js.parseString(decryptedXML, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    } catch (error) {
      console.error('Error parsing IPN response:', error);
      throw error;
    }
  }
}

module.exports = NetopiaPayment;
