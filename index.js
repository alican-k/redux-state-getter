const R = require('ramda')
const { compose, ifElse, has, identity, map, mapObjIndexed, mergeAll, pick, prop } = R

const defaultToAltState = altName => func => compose(
	func,
	ifElse(has(altName), prop(altName), identity)
)

const allInObj = altGetter => keys => state => {
	const arr = map(
		key => ({[key]: prop(key, altGetter)(state)}), 
		keys
	)
	return mergeAll(arr)
}	

const altState = (altName, functions) => {
	const functionsWithAltState = mapObjIndexed(
		defaultToAltState(altName), 
		functions
	)
	return mergeAll([
		{
			self	: pick([altName]),
			pick	: allInObj(functionsWithAltState)
		},
		functionsWithAltState
	])
}

module.exports = altState