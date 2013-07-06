(function (define) { 'use strict';
define(function (require) {
	return {
		build: build
	};

	function build(rows, cols, reserved) {
		return buildBlocks(rows, cols);
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
