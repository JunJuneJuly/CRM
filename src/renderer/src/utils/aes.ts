// 引入AES源码js
import CryptoJS from 'crypto-js'

// 默认的KEY与IV如果没有给
// 秘钥：bGvnMc62sh5RV6zP
// 偏移量：1eZ43DLcYtV2xb3Y
const key = CryptoJS.enc.Utf8.parse( 'bGvnMc62sh5RV6zP' ) // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse( '1eZ43DLcYtV2xb3Y' ) // 十六位十六进制数作为密钥偏移量

// 解密方法
export function Decrypt(word) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}

// 加密方法
export function Encrypt(word) {
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.ciphertext.toString().toUpperCase()
}