import { AdminChanged, Upgraded } from './types/CollectionProxy/CollectionProxy'
import { handleCollectionAdminChanged, handleCollectionUpgraded } from './utils/helper'

export function handleAdminChanged(event: AdminChanged): void {
	handleCollectionAdminChanged(event.address, event.params.newAdmin)
}

export function handleUpgraded(event: Upgraded): void {
	handleCollectionUpgraded(event.address, event.params.implementation)
}
