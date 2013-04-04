var Benchmark = function() { 
	this.benchmarks = {};	
};
Benchmark.prototype.unique = 1;
Benchmark.prototype.start = function(key) {
	this.benchmarks[key] = {
		start: +new Date(),
		diff: null
	};
};
Benchmark.prototype.aggregate = function(key) {
	if (this.benchmarks[key]) {
		this.benchmarks[key].start = +new Date();
	}
	else {
		this.start(key);
	}
};
Benchmark.prototype.aggregateAsync = function(key) {
	var unique = this.unique++;
	if (!this.benchmarks[key]) {
		this.benchmarks[key] = { };
	}
	this.start(key + '_' + unique);
	return unique;
};
var aggregate_unique = '';
Benchmark.prototype.end = function(orig_key, unique) {
	var key = orig_key;
	if (unique) {
		key = orig_key + '_' + unique;
	}
	if (!this.benchmarks[key]) {
		return console.log("BENCHMARK DOES NOT EXIST: " + key);
	}
	if (!this.benchmarks[key].start) {
		return console.log("BENCHMARK HAS NO START: " + key);
	}
	this.benchmarks[key].end = +new Date();
	var diff = this.benchmarks[key].end - this.benchmarks[key].start;
	if (diff > 0 || !this.benchmarks[orig_key].diff) {
		if (this.benchmarks[orig_key].diff) {
			this.benchmarks[orig_key].diff += diff;
		}
		else {
			this.benchmarks[orig_key].diff = diff;
		}
	}
	if (unique) {
		delete this.benchmarks[key];
	}
};
Benchmark.prototype.report = function() {
	var keys = [];
	var bad_keys = [];
	for (var key in this.benchmarks) {
		if (this.benchmarks[key].diff !== null) {
			keys.push(key);
		}
		else {
			bad_keys.push(key);
		}
	}
	if (keys.length || bad_keys.length) {
		console.log("BENCHMARK REPORT:");
		if (bad_keys.length) {
			console.log("The following benchmarks have not ended: " + bad_keys.join(', '));
		}
		if (keys.length) {
			keys.sort(_.bind(function(a, b) {
				return this.benchmarks[a].diff - this.benchmarks[b].diff;
			}, this)).map(_.bind(function(key) {
				console.log(key + ": " + this.benchmarks[key].diff + "ms");
				delete this.benchmarks[key];
			}, this));
		}
		console.log(this.benchmarks);
	}
};

if (typeof exports !== 'undefined') {
	exports.Bench = Bench;
}
