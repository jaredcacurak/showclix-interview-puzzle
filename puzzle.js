(function (define) { 'use strict';
define(function (require) {
	return {
		build: build
	};

	function build(rows, cols, reserved) {
		return without(reserved, buildBlocks(rows, cols));
	}

	function without(reserved, blocks) {
		if (!reserved.length) { return blocks; }

		return blocks.reduce(function (memo, block) {
			var values, from;

			values = block.map(function (seat) { return seat.value; });
			from = 0;

			reserved.forEach(function (reservedSeat, i) {
				var seat = values.indexOf(reservedSeat, from);

				if (seat >= 0) {
					memo.push(block.slice(from, seat));
					from = seat + 1;
				}

				if (reserved.length === i + 1) {
					memo.push(block.slice(from - block.length));
				}
			});

			return memo;
		}, []);
	}

	function buildBlocks(rows, cols) {
		var blocks, r, block, c;

		blocks = [];

		for (r = 1; r <= rows; r += 1) {
			block = [];
			for (c = 1; c <= cols; c += 1) {
				block.push({
					value: 'R' + r + 'C' + c,
					row: r,
					column: c
				});
			}
			blocks.push(block);
		}
		return blocks;
	}
});

})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
