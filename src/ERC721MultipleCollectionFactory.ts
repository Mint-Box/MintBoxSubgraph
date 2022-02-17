import { Deployed } from './types/ERC721MultipleCollectionFactory/ERC721MultipleCollectionFactory'
import { saveCollectionDeployed, saveCollection } from './utils/helper'

export function handleDeployed(event: Deployed): void {
	saveCollectionDeployed(
		event.params.proxy,
		event.params.owner,
		event.params.root,
		event.params.name,
		event.params.symbol,
		event.params.imp,
		event.params.admin,
		event.params.salt,
		'ERC721-Multiple',
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
		event.params.root,
		event.params.name,
		event.params.symbol,
		event.params.imp,
		event.params.admin,
		event.params.salt,
		'ERC721-Multiple',
		event.address,
		event.params.param.payToken,
		event.params.param.price,
		event.params.param.open,
		event.params.param.close,
		event.params.param.uri
	)
}
