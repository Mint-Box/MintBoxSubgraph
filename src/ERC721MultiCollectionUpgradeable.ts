import { BigInt } from '@graphprotocol/graph-ts'
import {
	AddRoot,
	ClaimToken,
	MintToken,
	Transfer,
	Payment,
	SetClose,
	SetOpen,
	SetPrice,
	SetPayToken,
	SetContractURI,
	SetParam,
	Withdrawal,
	OwnershipTransferred
} from './types/ERC721MultiCollectionUpgradeable/ERC721MultiCollectionUpgradeable'
import {
	handleMultipleRoot,
	handleMultipleClaimTokenInBox,
	handleTokenMintedInBox,
	saveWithdrawal,
	saveCollectionOpen,
	saveCollectionClose,
	saveCollectionPayToken,
	saveCollectionPrice,
	saveCollectionContractURI,
	saveCollectionParam,
	saveERC721Transfer,
	savePayment,
	saveCollectionOwnership,
} from './utils/helper'

export function handleAddRoot(event: AddRoot): void {
	handleMultipleRoot(
		event.address,
		event.params.root
	)
}

export function handleClaimToken(event: ClaimToken): void {
	handleMultipleClaimTokenInBox(
		event.address,
		event.params.tokenId,
		event.params.root,
		event.params.uri,
		event.params.creator,
		event.params.proofs
	)
}

export function handleMintToken(event: MintToken): void {
	handleTokenMintedInBox(
		event.address,
		event.params.tokenId,
		BigInt.fromU32(0)
	)
}

export function handleWithdrawal(event: Withdrawal): void {
	saveWithdrawal(
		event.address,
		event.params.payToken,
		event.params.to,
		event.params.amount,
		event.block.timestamp,
		event.transaction.hash
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

export function handleTransfer(event: Transfer): void {
	saveERC721Transfer(
		event.address,
		event.params.from,
		event.params.to,
		event.params.tokenId,
		event.block.timestamp,
		event.transaction.hash
	)
}

export function handlePayment(event: Payment): void {
	savePayment(
		event.address,
		event.params.payToken,
		event.params.from,
		event.params.to,
		event.params.tokenId,
		BigInt.fromU32(1),
		event.params.amount,
		event.block.timestamp,
		event.transaction.hash
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
