
import CryptoJS from 'crypto-js';
const secretKey = 'dswfgyvbasthnjuf'; // Java 后端使用的 AES 密钥
// AES 解密函数
export const decryptAES =(encryptedData)=> {
  // 将密钥转换为 WordArray 对象
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  
  // Base64 解码加密数据
  const decodedData = CryptoJS.enc.Base64.parse(encryptedData);

  // AES 解密操作，使用 ECB 模式和 PKCS7 填充
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: decodedData }, 
    key, 
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  );
  // 返回解密后的字符串
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// AES 加密函数
export const encryptAES = (plainText) => {
  // 将密钥转换为 WordArray 对象
  const key = CryptoJS.enc.Utf8.parse(secretKey);

  // AES 加密操作，使用 ECB 模式和 PKCS7 填充
  const encrypted = CryptoJS.AES.encrypt(
    plainText, 
    key, 
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  );
  // 返回 Base64 格式的加密字符串
  return encrypted.toString();
};
