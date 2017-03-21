describe('Premise Model', function() {
	var Premise, premise;
	beforeEach(angular.mock.module('logicToolsApp'));
	beforeEach(inject(function(_Premise_) {
		Premise = _Premise_;
	}));
	it('Should return p', function() {
		premise = Premise.new({
			value: 'p'
		});
		expect(premise.value).toEqual('p');
	});
	it('Should return p', function() {
		premise = Premise.new({
			value: '(p&q)=>(q&r)'
		});
		expect(premise.digest()).toEqual('A=>B');
	});
});