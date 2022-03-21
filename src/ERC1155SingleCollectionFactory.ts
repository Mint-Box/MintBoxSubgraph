import { Bytes } from '@graphprotocol/graph-ts'
import { Deployed } from './types/ERC1155SingleCollectionFactory/ERC1155SingleCollectionFactory'
import { saveCollectionDeployed, saveCollection } from './utils/helper'

export function handleDeployed(event: Deployed): void {

	saveCollectionDeployed(
		event.params.proxy,
		event.params.owner,
		Bytes.empty(),
		event.params.name,
		event.params.symbol,
		event.params.imp,
		event.params.salt,
		event.params.pool,
		'ERC1155-Single',
		event.address,
		event.params.param.payToken,
		event.params.param.price,
		event.params.param.open,
		event.params.param.close,
		event.params.param.uri,
		event.block.timestamp,
		event.transaction.hash
	)

	saveCollection(
		event.params.proxy,
		event.params.owner,
		Bytes.empty(),
		event.params.name,
		event.params.symbol,
		event.params.imp,
		event.params.salt,
		event.params.pool,
		'ERC1155-Single',
		event.address,
		event.params.param.payToken,
		event.params.param.price,
		event.params.param.open,
		event.params.param.close,
		event.params.param.uri
	)
}
