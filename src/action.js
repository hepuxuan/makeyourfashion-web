const TOGGLE_PRODUCT_MODEL = 'TOGGLE_PRODUCT_MODEL'
const UPDATE_ORDER = 'UPDATE_ORDER'

const toggleProductModel = {
	type: TOGGLE_PRODUCT_MODEL
}

function updateOrder (id) {
	return {
		type: UPDATE_ORDER,
		payload: id
	}
}
export {
	TOGGLE_PRODUCT_MODEL,
	UPDATE_ORDER,
	toggleProductModel,
	updateOrder
}
