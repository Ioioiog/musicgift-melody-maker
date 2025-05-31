
const forge = require('node-forge');

class NetopiaEncryption {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  encrypt(data) {
    try {
      // Convert data to string if it's an object
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Create RC4 cipher with a random key
      const rc4Key = forge.random.getBytesSync(32);
      const cipher = forge.cipher.createCipher('RC4', rc4Key);
      
      cipher.start();
      cipher.update(forge.util.createBuffer(dataString, 'utf8'));
      cipher.finish();
      
      const encryptedData = cipher.output.getBytes();
      
      // Encrypt the RC4 key with RSA public key
      const publicKeyObj = forge.pki.publicKeyFromPem(this.publicKey);
      const encryptedKey = publicKeyObj.encrypt(rc4Key, 'RSA-OAEP');
      
      // Combine encrypted key and data
      const result = forge.util.encode64(encryptedKey + encryptedData);
      
      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData) {
    try {
      const decodedData = forge.util.decode64(encryptedData);
      
      // Extract the encrypted RC4 key (first 256 bytes for 2048-bit RSA key)
      const encryptedKey = decodedData.substring(0, 256);
      const encryptedContent = decodedData.substring(256);
      
      // Decrypt the RC4 key with RSA private key
      const privateKeyObj = forge.pki.privateKeyFromPem(this.privateKey);
      const rc4Key = privateKeyObj.decrypt(encryptedKey, 'RSA-OAEP');
      
      // Decrypt the content with RC4
      const decipher = forge.cipher.createDecipher('RC4', rc4Key);
      decipher.start();
      decipher.update(forge.util.createBuffer(encryptedContent, 'binary'));
      decipher.finish();
      
      return decipher.output.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

module.exports = NetopiaEncryption;
