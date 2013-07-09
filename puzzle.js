(function (define) { 'use strict';
define(function (require) {
	return {
		build: build,
		reserve: reserve
	};

	function build(rows, cols, reserved) {
		return toVenue(without(reserved, buildBlocks(rows, cols)))
				.sort(byAscending('distance'));
	}

	function reserve(map, n) {
		var i, seats, found, reserved;

		if (n > 10) {
			console.log('The maximum tickets that can request at once is 10');
			return map;
		}

		for (i = 0; i <= map.length; i += 1) {
			seats = map[i] && map[i].seats;

			if (seats && seats.length >= n) {
				found = true;

				if (seats.length === n) {
					reserved = seats;
					delete map[i];
				} else {
					reserved = seats.splice(0, n);
					map[i].distance = seats[0].distance;
					map.sort(byAscending('distance'));
				}
				print(reserved);
				break;
			}
		}

		if (!found) { console.log('Not Available'); }
		return map;
	}

	function toVenue(blocks) {
		return blocks.filter(function (block) {
			return block.length;
		}).map(function (block) {
			block.sort(byAscending('distance'));
			return {
				seats: block,
				distance: block[0].distance
			}
		});
	}

	function byAscending(property) {
		return function (a, b) {
			return a[property] - b[property];
		};
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
		var blocks, bestSeat, r, block, c;

		blocks = [];
		bestSeat = frontAndCenter(cols);

		for (r = 1; r <= rows; r += 1) {
			block = [];
			for (c = 1; c <= cols; c += 1) {
				block.push({
					value: 'R' + r + 'C' + c,
					row: r,
					column: c,
					distance: manhattanDistance(bestSeat, r, c)
				});
			}
			blocks.push(block);
		}
		return blocks;
	}

	function print(seats) {
		if (seats.length === 1) {
			console.log(seats[0].value);
		} else {
			seats.sort(byAscending('column'));
			console.log(seats[0].value + '-' + seats[seats.length - 1].value);
		}
		return seats;
	}

	function frontAndCenter(cols) {
		var center, parity;

		parity = cols % 2;
		center = (cols + parity) / 2;
		return (parity) ? [center] : [center, center + 1];
	}

	function manhattanDistance(from, row, column) {
		return from.map(function (seat) {
			return Math.abs(1 - row) + Math.abs(seat - column);
		}).sort(function (a, b) { return a - b })[0];
	}
});

})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
