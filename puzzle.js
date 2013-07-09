(function (define) { 'use strict';
define(function (require) {

	// Public API
	return {
		build: build,
		reserve: reserve
	};

	/**
	 * Simply builds and returns a data structure to represent a seating map.
	 *
	 * @param {number} rows The number of rows.
	 * @param {number} cols The number of columns (a.k.a. seats per row)
	 * @param {array} reserved A 1D array of strings representing the seats that are already reserved (formatted as "R1C1")
	 * @returns {array}
	 */
	function build(rows, cols, reserved) {
		return seatingMap(without(reserved, buildBlocks(rows, cols)))
				.sort(byAscending('distance'));
	}

	/**
	 * Reserves the best available contiguous block of n seats and returns map with those seats reserved.
	 *
	 * @param {array} map The seating map.
	 * @param {number} n The number of contiguous seats in a row someone is looking to reserve.
	 * @returns {array} The map with the best available seats now reserved.
	 */
	function reserve(map, n) {
		var i, seats, found, reserved;

		// guard against reservation requests greater than ten
		if (n > 10) {
			console.log('The maximum tickets that can request at once is 10');
			return map;
		}

		for (i = 0; i <= map.length; i += 1) {
			seats = map[i] && map[i].seats;

			// if an acceptable seating was found
			if (seats && seats.length >= n) {
				found = true;

				// if the number of seats is an exact match
				// delete the element from the map
				if (seats.length === n) {
					reserved = seats;
					delete map[i];
				}
				// else reserve the best availabe seats by removing them
				// then recalculate the new seating blocks distance with
				// regards to the map
				else {
					reserved = seats.splice(0, n);
					map[i].distance = seats[0].distance;
					map.sort(byAscending('distance'));
				}
				print(reserved);	// print the start and end seats that were just reserved
				break;
			}
		}

		// if it's not possible to fulfill a request
		if (!found) { console.log('Not Available'); }
		return map;
	}

	/**
	 * Creates a data structure that represents the seating map.
	 *
	 * @param {array} blocks The seating blocks to be evaluated.
	 * @returns {array} An array of objects containing a seating block and the least distance to front and center.
	 */
	function seatingMap(blocks) {
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

	/**
	 * A partial function used to make sorting more palatable.
	 *
	 * @param {string} property The property to examine.
	 * @returns {function} A function that calculates the difference of two properties.
	 */
	function byAscending(property) {
		return function (a, b) {
			return a[property] - b[property];
		};
	}

	/**
	 * Removes reserved seats from the seating blocks.
	 *
	 * @param reserved {array} A 1D array of strings representing the seats that are already reserved (formatted as "R1C1")
	 * @param blocks {array} The seating blocks.
	 * @returns {array} The seating blocks with the reserved seats removed.
	 */
	function without(reserved, blocks) {

		// guard against an empty array of reserved seats
		if (!reserved.length) { return blocks; }

		return blocks.reduce(function (memo, block) {
			var values, from;

			values = block.map(function (seat) { return seat.value; });
			from = 0;

			reserved.forEach(function (reservedSeat, i) {
				var seat = values.indexOf(reservedSeat, from);

				// capture the the seats leading upto the reserved seat
				if (seat >= 0) {	// the reserved seat was found
					memo.push(block.slice(from, seat));
					from = seat + 1;
				}

				// capture the rest of the seats in the row
				if (reserved.length === i + 1) {	// exhausted the reserved seats
					memo.push(block.slice(from - block.length));
				}
			});

			return memo;
		}, []);
	}

	/**
	 * Build an array of seating blocks.
	 *
	 * @param row {number} The number of rows.
	 * param cols {number} The number of columns (a.k.a. seats per row).
	 * returns {array} The seating blocks.
	 */
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

	/**
	 * Print the start and end seats.
	 *
	 * @param {array} seats The seats to be printed.
	 * @returns {array} The seats passed in.
	 */
	function print(seats) {

		// if there is only one seat print that seat's value
		if (seats.length === 1) {
			console.log(seats[0].value);
		}
		// else print the outter most seat values
		else {
			seats.sort(byAscending('column'));
			console.log(seats[0].value + '-' + seats[seats.length - 1].value);
		}
		return seats;
	}

	/**
	 * Calculates the column number of the front center seat(s).
	 * 
	 * @param {number} cols The number of columns.
	 * @returns {array} The center seat(s).
	 */
	function frontAndCenter(cols) {
		var center, parity;

		parity = cols % 2;
		center = (cols + parity) / 2;
		return (parity) ? [center] : [center, center + 1];
	}

	/**
	 * Calculates the Manhattan Distance between a seat in the front row and any other seat.
	 *
	 * @see <a href="http://en.wikipedia.org/wiki/Taxicab_geometry">Taxicab geometry</a>
	 * @param {number} from The column in the front row.
	 * @param {number} row The row of the seat.
	 * @param {number} column The column of the seat.
	 * @returns {number} The closest distance.
	 */
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
