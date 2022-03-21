import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
	AddToken,
	MintToken,
	TransferSingle,
	TransferBatch,
	Payment,
	SetClose,
	SetOpen,
	SetPrice,
	SetPayToken,
	SetContractURI,
	SetParam,
	OwnershipTransferred,
	ERC1155SingleCollectionUpgradeable
} from './types/ERC1155SingleCollectionUpgradeable/ERC1155SingleCollectionUpgradeable'
import {
	handleSingleTokenAddedInBox,
	handleTokenMintedInBox,
	saveERC1155Transfer,
	saveCollectionOpen,
	saveCollectionClose,
	saveCollectionPayToken,
	saveCollectionPrice,
	saveCollectionContractURI,
	saveCollectionParam,
	savePayment,
	saveCollectionOwnership,
} from './utils/helper'

export function handleTransferSingle(event: TransferSingle): void {
	saveERC1155Transfer(
		event.address,
		event.params.from,
		event.params.to,
		event.params.id,
		event.params.value,
		amountOf,
		event.block.timestamp,
		event.transaction.hash
	)
}

export function handleTransferBatch(event: TransferBatch): void {
	for (let i = 0; i < event.params.ids.length; i++) {
		saveERC1155Transfer(
			event.address,
			event.params.from,
			event.params.to,
			event.params.ids[i],
			event.params.values[i],
			amountOf,
			event.block.timestamp,
			event.transaction.hash
		)
	}
}

function amountOf(contract: Address, owner: Address, tokenId: BigInt): BigInt {
	const result = ERC1155SingleCollectionUpgradeable.bind(contract).try_balanceOf(owner, tokenId)
	if (result.reverted) {
		return BigInt.fromU32(0)
	}
	return result.value
}

export function handlePayment(event: Payment): void {
	savePayment(
		event.address,
		event.params.payToken,
		event.params.from,
		event.params.to,
		event.params.tokenId,
		event.params.amount,
		event.params.value,
		event.block.timestamp,
		event.transaction.hash
	)
}

export function handleAddToken(event: AddToken): void {
	handleSingleTokenAddedInBox(
		event.address,
		event.params.tokenId,
		event.params.uri,
		event.params.creator,
		event.params.supply
	)
}

export function handleMintToken(event: MintToken): void {
	const supply = ERC1155SingleCollectionUpgradeable.bind(event.address).tokens(event.params.tokenId).value4
	handleTokenMintedInBox(
		event.address,
		event.params.tokenId,
		supply
	)
}

export function handleSetClose(event: SetClose): void {
	saveCollectionClose(event.address, event.params.time)
}

export function handleSetOpen(event: SetOpen): void {
	saveCollectionOpen(event.address, event.params.time)
}

export function handleSetPrice(event: SetPrice): void {
	saveCollectionPrice(event.address, event.params.price)
}

export function handleSetPayToken(event: SetPayToken): void {
	saveCollectionPayToken(event.address, event.params.payToken)
}

export function handleSetContractURI(event: SetContractURI): void {
	saveCollectionContractURI(event.address, event.params.uri)
}

export function handleSetParam(event: SetParam): void {
	saveCollectionParam(
		event.address,
		event.params.param.open,
		event.params.param.close,
		event.params.param.payToken,
		event.params.param.price,
		event.params.param.uri
	)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
	saveCollectionOwnership(
		event.address,
		event.params.previousOwner,
		event.params.newOwner,
		event.block.timestamp,
		event.transaction.hash
	)
}
