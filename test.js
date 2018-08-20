const R = require('ramda')
const altState = require('./index')
const assert = require('assert')

const { prop } = R

const state = {
	altState1	: {
		altState1Prop1	: 'altState1Prop1Value',
	},
	altState2	: {
		altState2Prop1	: 'altState2Prop1Value',
		altState2Prop2	: 'altState2Prop2Value',		
	}
}

const altState1Getter1 = prop('altState1Prop1')
const altState1 = altState('altState1', {altState1Getter1})

const altState2Getter1 = prop('altState2Prop1')
const altState2Getter2 = prop('altState2Prop2')
const altState2 = altState('altState2', {altState2Getter1, altState2Getter2})

it('altState.self correctly get the altState', function(){
	assert.deepEqual(altState1.self(state), {
		altState1	: {
			altState1Prop1	: 'altState1Prop1Value',
		}
	})
})
it('altState.someGetter correctly get the related field', function(){
	assert.equal(altState2.altState2Getter1(state), 'altState2Prop1Value')
})
it('altState.pick correctly get the related fields in object with related keys', function(){
	assert.deepEqual(altState2.pick(['altState2Getter1', 'altState2Getter2'])(state), {
		altState2Getter1: 'altState2Prop1Value',
		altState2Getter2: 'altState2Prop2Value',		
	})
})

