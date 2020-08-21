import {
  AwsKmsSigner,
  AwsKmsKeyStore,
  LogLevel,
  initOracleLib,
  updateOracleFromCoinbaseOnce,
} from '@tacoinfra/harbinger-lib'

const logLevel = LogLevel.Debug

export default async function main(
  oracleContractAddress: string,
  awsKmsKeyId: string,
  awsRegion: string,
  nodeURL: string,
  apiKeyId: string,
  apiSecret: string,
  apiPassphrase: string,
  assetNames: Array<string>,
  normalizerContractAddress: string | undefined
): Promise<string> {
  initOracleLib('debug')

  const store = await AwsKmsKeyStore.from(awsKmsKeyId, awsRegion)
  const signer = new AwsKmsSigner(awsKmsKeyId, awsRegion)

  const hash = await updateOracleFromCoinbaseOnce(
    logLevel,
    apiKeyId,
    apiSecret,
    apiPassphrase,
    oracleContractAddress,
    assetNames,
    store,
    signer,
    nodeURL,
    normalizerContractAddress,
  )

  return hash
}
