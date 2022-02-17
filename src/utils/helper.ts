import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Collection, CollectionDeployed, Transfer, Token, Payment, Withdrawal, OwnershipTransfer, Box, MerkleRoot } from '.././types/schema';

export function validateCollectionAddress(addr: Address): boolean {
	const entity = Collection.load(addr.toHex())
	return !!entity
}

export function saveCollectionDeployed(
	contract: Address,
	owner: Bytes,
	root: Bytes,
	name: string,
	symbol: string,
	implementation: Address,
	admin: Address,
	salt: Bytes,
	type: string,
	factory: Bytes,
	payToken: Bytes,
	price: BigInt,
	open: BigInt,
	close: BigInt,
	uri: string,
	timestamp: BigInt,
	txHash: Bytes
): void {
	let entity = CollectionDeployed.load(contract.toHex())
	if (!entity) {
		entity = new CollectionDeployed(contract.toHex())
		entity.contract = contract
		entity.owner = owner
		entity.name = name
		entity.symbol = symbol
		entity.implementation = implementation
		entity.admin = admin
		entity.salt = salt
		entity.root = root
		entity.type = type
		entity.factory = factory
		entity.payToken = payToken
		entity.price = price
		entity.open = open
		entity.close = close
		entity.uri = uri
		entity.timestamp = timestamp
		entity.txHash = txHash
		entity.save()
	}
}

export function saveCollection(
	contract: Address,
	owner: Bytes,
	root: Bytes,
	name: string,
	symbol: string,
	implementation: Address,
	admin: Address,
	salt: Bytes,
	type: string,
	factory: Bytes,
	payToken: Bytes,
	price: BigInt,
	open: BigInt,
	close: BigInt,
	uri: string
): void {
	let entity = Collection.load(contract.toHex())
	if (!entity) {
		entity = new Collection(contract.toHex())
		entity.contract = contract
		entity.owner = owner
		entity.name = name
		entity.symbol = symbol
		entity.implementation = implementation
		entity.admin = admin
		entity.salt = salt
		entity.root = root
		entity.type = type
		entity.factory = factory
		entity.payToken = payToken
		entity.price = price
		entity.open = open
		entity.close = close
		entity.uri = uri
		entity.save()
	}
}

export function saveERC721Transfer(
	contract: Address,
	from: Address,
	to: Address,
	tokenId: BigInt,
	timestamp: BigInt,
	txHash: Bytes
): void {
	if (!validateCollectionAddress(contract)) {
		return
	}
	const id = `${txHash.toHex()}`
	let entity = Transfer.load(id)
	if (!entity) {
		entity = new Transfer(id)
		entity.contract = contract
		entity.from = from
		entity.to = to
		entity.tokenId = tokenId
		entity.amount = BigInt.fromU32(1)
		entity.txHash = txHash
		entity.timestamp = timestamp
		entity.save()
	}

	const fromId = `${contract.toHex()}-${from.toHex()}-${tokenId}`
	const toId = `${contract.toHex()}-${to.toHex()}-${tokenId}`
	if (!from.equals(Address.zero())) {
		const tokenFrom = Token.load(fromId)!
		tokenFrom.amount = BigInt.fromU32(0)
		tokenFrom.save()
	}
	let tokenTo = Token.load(toId)
	if (!tokenTo) {
		tokenTo = new Token(toId)
		tokenTo.contract = contract
		tokenTo.tokenId = tokenId
		tokenTo.owner = to
		tokenTo.amount = BigInt.fromU32(1)
		tokenTo.save()
	}

}

export function saveERC1155Transfer(
	contract: Address,
	from: Address,
	to: Address,
	tokenId: BigInt,
	amount: BigInt,
	amountOf: (contract: Address, owner: Address, tokenId: BigInt) => BigInt,
	timestamp: BigInt,
	txHash: Bytes
): void {
	if (!validateCollectionAddress(contract)) {
		return
	}
	const id = `${txHash.toHex()}`
	let entity = Transfer.load(id)
	if (!entity) {
		entity = new Transfer(id)
		entity.contract = contract
		entity.from = from
		entity.to = to
		entity.tokenId = tokenId
		entity.amount = amount
		entity.txHash = txHash
		entity.timestamp = timestamp
		entity.save()
	}

	const fromId = `${contract.toHex()}-${from.toHex()}-${tokenId}`
	const toId = `${contract.toHex()}-${to.toHex()}-${tokenId}`
	if (!from.equals(Address.zero())) {
		const tokenFrom = Token.load(fromId)!
		tokenFrom.amount = amountOf(contract, from, tokenId)
		tokenFrom.save()
	}
	let tokenTo = Token.load(toId)
	if (!tokenTo) {
		tokenTo = new Token(toId)
		tokenTo.contract = contract
		tokenTo.tokenId = tokenId
		tokenTo.owner = to
	}
	tokenTo.amount = amountOf(contract, to, tokenId)
	tokenTo.save()

}

export function savePayment(
	contract: Address,
	token: Bytes,
	from: Bytes,
	to: Bytes,
	tokenId: BigInt,
	amount: BigInt,
	value: BigInt,
	timestamp: BigInt,
	txHash: Bytes
): void {
	if (!validateCollectionAddress(contract)) {
		return
	}
	const id = txHash.toHex()
	let entity = Payment.load(id)
	if (!entity) {
		entity = new Payment(id)
		entity.contract = contract
		entity.from = from
		entity.to = to
		entity.token = token
		entity.tokenId = tokenId
		entity.amount = amount
		entity.value = value
		entity.txHash = txHash
		entity.timestamp = timestamp
		entity.save()
	}
}

export function saveCollectionOwnership(
	contract: Address,
	from: Bytes,
	to: Bytes,
	timestamp: BigInt,
	txHash: Bytes
): void {
	if (!validateCollectionAddress(contract)) {
		return
	}
	const id = txHash.toHex()
	let entity = OwnershipTransfer.load(id)
	if (!entity) {
		entity = new OwnershipTransfer(id)
		entity.contract = contract
		entity.from = from
		entity.to = to
		entity.txHash = txHash
		entity.timestamp = timestamp
		entity.save()
	}
	const contractEntity = Collection.load(contract.toHex())
	contractEntity!.owner = to
	contractEntity!.save()
}

export function handleSingleTokenAddedInBox(
	contract: Address,
	tokenId: BigInt,
	uri: string,
	creator: Address,
	supply: BigInt
): void {
	const id = `${contract.toHex()}-${tokenId.toHex()}`
	let box = Box.load(id)
	if (!box) {
		box = new Box(id)
		box.contract = contract
		box.tokenId = tokenId
		box.uri = uri
		box.creator = creator
		box.supply = supply
		box.type = 'ERC721SingleBox'
		box.status = 'Added'
		box.save()
	}
}

export function handleTokenMintedInBox(
	contract: Address,
	tokenId: BigInt,
	supply: BigInt
): void {
	const id = `${contract.toHex()}-${tokenId.toHex()}`
	const box = Box.load(id)
	if (!box) {
		return
	}
	box.supply = supply
	box.status = 'Minted'
	box.save()
}

export function handleMultipleRoot(contract: Address, root: Bytes): void {
	const id = `${contract.toHex()}-${root.toHex()}`
	let merkle = MerkleRoot.load(id)
	if (!merkle) {
		merkle = new MerkleRoot(id)
		merkle.root = root
		merkle.contract = contract
	}
}

export function handleMultipleClaimTokenInBox(
	contract: Address,
	tokenId: BigInt,
	root: Bytes,
	uri: string,
	creator: Address,
	proofs: Bytes[]
): void {
	const id = `${contract.toHex()}-${tokenId.toHex()}`
	let box = Box.load(id)
	if (!box) {
		box = new Box(id)
		box.contract = contract
		box.tokenId = tokenId
		box.root = root
		box.uri = uri
		box.creator = creator
		box.proofs = proofs
		box.supply = BigInt.fromU32(1)
		box.type = 'ERC721MultipleBox'
		box.status = 'Claimed'
		box.save()
	}
}

export function handleMultipleMintTokenInBox(
	contract: Address,
	tokenId: BigInt
): void {
	const id = `${contract.toHex()}-${tokenId.toHex()}`
	let box = Box.load(id)
	if (!box) {
		box = new Box(id)
		box.supply = BigInt.fromU32(0)
		box.status = 'Minted'
		box.save()
	}
}

export function handleCollectionAdminChanged(contract: Address, admin: Address): void {
	let entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.admin = admin
	entity.save()
}

export function handleCollectionUpgraded(contract: Address, implementation: Address): void {
	let entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.implementation = implementation
	entity.save()
}

export function saveCollectionOpen(contract: Address, time: BigInt): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.open = time
	entity.save()
}

export function saveCollectionClose(contract: Address, time: BigInt): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.close = time
	entity.save()
}

export function saveCollectionPayToken(contract: Address, payToken: Address): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.payToken = payToken
	entity.save()
}

export function saveCollectionPrice(contract: Address, price: BigInt): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.price = price
	entity.save()
}

export function saveCollectionContractURI(contract: Address, contractURI: string): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.uri = contractURI
	entity.save()
}

export function saveCollectionParam(
	contract: Address,
	open: BigInt,
	close: BigInt,
	payToken: Address,
	price: BigInt,
	contractURI: string
): void {
	const entity = Collection.load(contract.toHex())
	if (!entity) {
		return
	}
	entity.open = open
	entity.close = close
	entity.payToken = payToken
	entity.price = price
	entity.uri = contractURI
	entity.save()
}

export function saveWithdrawal(
	contract: Address,
	token: Address,
	to: Address,
	value: BigInt,
	timestamp: BigInt,
	txHash: Bytes
): void {
	let entity = Withdrawal.load(txHash.toHex())
	if (!entity) {
		entity = new Withdrawal(txHash.toHex())
		entity.contract = contract
		entity.token = token
		entity.to = to
		entity.value = value
		entity.timestamp = timestamp
		entity.txHash = txHash
		entity.save()
	}
}