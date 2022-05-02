import EC from "elliptic";

// [secp256k1] This is the alogrithm that's also the basis of btc wallet.
const ec = new EC.ec("secp256k1");

const key = ec.genKeyPair();

const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log("private key ", privateKey);

console.log("public key ", publicKey);
