import { APIGatewayProxyHandler } from 'aws-lambda'
import main from './src/index'
import { initOracleLib } from '@tacoinfra/harbinger-lib'
import { KmsKeyStore } from '@tacoinfra/conseil-kms'

export const updateOracle: APIGatewayProxyHandler = async (
  _event,
  _context,
) => {
  const awsKmsKeyId = process.env.AWS_KMS_KEY_ID
  const awsKmsKeyRegion = process.env.AWS_KMS_KEY_REGION
  const oracleContractAddress = process.env.ORACLE_CONTRACT_ADDRESS
  const nodeAddr = process.env.NODE_ADDR
  const coinbaseApiKeyId = process.env.COINBASE_API_KEY_ID
  const coinbaseApiKeySecret = process.env.COINBASE_API_KEY_SECRET
  const coinbaseApiKeyPassphrase = process.env.COINBASE_API_KEY_PASSPHRASE
  const assetList = process.env.ASSETS
  const normalizerContractAddress =
    process.env.NORMALIZER_CONTRACT_ADDRESS !== ''
      ? process.env.NORMALIZER_CONTRACT_ADDRESS
      : undefined
  const signerUrl = process.env.SIGNER_URL

  if (
    awsKmsKeyId === undefined ||
    awsKmsKeyRegion === undefined ||
    oracleContractAddress === undefined ||
    nodeAddr === undefined ||
    coinbaseApiKeyId === undefined ||
    coinbaseApiKeySecret === undefined ||
    coinbaseApiKeyPassphrase === undefined ||
    assetList === undefined ||
    signerUrl === undefined
  ) {
    return {
      statusCode: 500,
      body: 'Fatal: Missing an input. Please check your configuration.',
    }
  }

  const assets = assetList.split(',').sort()

  try {
    const hash = await main(
      oracleContractAddress,
      signerUrl,
      awsKmsKeyId,
      awsKmsKeyRegion,
      nodeAddr,
      coinbaseApiKeyId,
      coinbaseApiKeySecret,
      coinbaseApiKeyPassphrase,
      assets,
      normalizerContractAddress,
    )
    return {
      statusCode: 200,
      body: hash,
    }
  } catch (exception) {
    return {
      statusCode: 500,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      body: `Error: ${JSON.stringify(exception.message)}`,
    }
  }
}

export const info: APIGatewayProxyHandler = async (_event, _context) => {
  const awsKmsKeyId = process.env.AWS_KMS_KEY_ID
  const awsKmsKeyRegion = process.env.AWS_KMS_KEY_REGION
  const oracleContractAddress = process.env.ORACLE_CONTRACT_ADDRESS
  const nodeAddr = process.env.NODE_ADDR
  const coinbaseApiKeyId = process.env.COINBASE_API_KEY_ID
  const coinbaseApiKeySecret = process.env.COINBASE_API_KEY_SECRET
  const coinbaseApiKeyPassphrase = process.env.COINBASE_API_KEY_PASSPHRASE
  const assetList = process.env.ASSETS

  if (
    awsKmsKeyId === undefined ||
    awsKmsKeyRegion === undefined ||
    oracleContractAddress === undefined ||
    nodeAddr === undefined ||
    coinbaseApiKeyId === undefined ||
    coinbaseApiKeySecret === undefined ||
    coinbaseApiKeyPassphrase === undefined ||
    assetList === undefined
  ) {
    return {
      statusCode: 500,
      body: 'Fatal: Missing an input. Please check your configuration.',
    }
  }

  initOracleLib('error')

  const store = await KmsKeyStore.from(awsKmsKeyId, awsKmsKeyRegion)
  const resp = {
    awsKmsKeyId,
    awsKmsKeyRegion,
    oracleContractAddress,
    nodeAddr,
    assetList,
    signerPublicKeyHash: store.publicKeyHash,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  }
}
