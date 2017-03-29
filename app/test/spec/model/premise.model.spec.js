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
	it('Should return 1=>2', function() {
		premise = Premise.new({
			value: '(p&q)=>(q&r)'
		});
		expect(premise.digest()).toEqual('1=>2');
	});
	it('Should return 4=>5', function() {
		premise = Premise.new({
			value: '((p=>q)&q&s)=>((q=>r)&(p|q|s))'
		});
		expect(premise.digest()).toEqual('4=>5');
	});
	it('Should return 6=>5', function() {
		premise = Premise.new({
			value: '(((p=>q)&q&s)&t)=>((q=>r)&(p|q|s)&t)'
		});
		expect(premise.digest()).toEqual('6=>5');
	});
	it('Should return ~1=>2', function() {
		premise = Premise.new({
			value: '~(p&q)=>(~p|~q)'
		});
		expect(premise.digest()).toEqual('~1=>2');
	});
	it('Should return 3=>2', function() {
		premise = Premise.new({
			value: '((p=>q)&q)=>(~q=>r)'
		});
		expect(premise.digest()).toEqual('3=>2');
	});
	it('Should return 4=>5', function() {
		premise = Premise.new({
			value: '((p=>q)&q)=>((q=>r)&(p|q))'
		});
		expect(premise.digest()).toEqual('4=>5');
	});
	it('Should return 4&5', function() {
		premise = Premise.new({
			value: '((p=>q)&q)&((q=>r)&(p|q))'
		});
		expect(premise.digest()).toEqual('4&5');
	});
	it('Should return 5&6&4', function() {
		premise = Premise.new({
			value: '((p=>q)&q)&((q=>r)&(p|q))&(~p|~q)'
		});
		expect(premise.digest()).toEqual('5&6&4');
	});
	it('Should return 5&6|4', function() {
		premise = Premise.new({
			value: '((p=>q)&q)&((q=>r)&(p|q))|(~p|~q)'
		});
		expect(premise.digest()).toEqual('5&6|4');
	});
	it('Should return 4=>5', function() {
		premise = Premise.new({
			value: '((p=>q)&q&s)=>((q=>r)&(p|q|s))'
		});
		premise.digest()
		expect(premise.expand('4')).toEqual('(p=>q)&q&s');
	});
	it('Should return 4=>5', function() {
		premise = Premise.new({
			value: '((p=>q)&q&s)=>((q=>r)&(p|q|s))'
		});
		premise.digest()
		expect(premise.expand('5')).toEqual('(q=>r)&(p|q|s)');
	});
	
});