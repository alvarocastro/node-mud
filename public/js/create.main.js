var MAP,
	$map,
	$element;


$(function () {
	$map = $('#map');
	$element = $('#element');

	$map.on('click', '.wall', wallClick);
	
	$element.on('click', 'form .add', elementEventAdd);
	$element.on('click', '.events .save', elementEventSave);
	$element.on('click', '.events .remove', elementEventRemove);
	$element.on('click', '.events .up', elementEventMoveUp);
	$element.on('click', '.events .down', elementEventMoveDown);
});

////////////////////////////////////////////////////////////////////////////////
////  Wall

/**
 * Fill the $element pane with the wall data.
 * on_look, on_walk, on_item_use
 */
function wallClick ()
{
	var $wall = $(this),
		$square = $wall.parent('.square'),
		$event,
		x = $square.attr('class').replace(/.*x([0-9]+).*/i, '$1'),
		y = $square.attr('class').replace(/.*y([0-9]+).*/i, '$1'),
		square = MAP.getSquare(x, y),
		side = $wall.attr('class').match(/north|east|south|west|floor/i).pop(),
		c, i;

	$element
		.data('x', x)
		.data('y', y)
		.data('side', side)
		.data('square', square);
	$element.find('.name').text('x: ' + x + ' | y: ' + y + ' | ' + side);
	$element.find('.events ul li:not(.mock)').remove();

	if (square.events[side].on_walk) {
		for (i = 0, c = square.events[side].on_walk.length; i < c; i++) {
			$event = $element.find('.events ul li.mock').clone().removeClass('mock');
			$event.find('.type').text(square.events[side].on_walk[i].type);
			$event.find('.value').text(JSON.stringify(square.events[side].on_walk[i].data));

			$element.find('.events ul').append($event);
			console.log(
				square.events[side].on_walk[i],
				JSON.stringify(square.events[side].on_walk[i].data)
			);
		}
	}

	$wall.parents('#map').find('.selected').removeClass('selected');
	$wall.toggleClass('selected');
}


function elementEventAdd ()
{
	var $form = $(this).closest('form'),
		$events = $element.find('.events ul'),
		$event = $events.find('li.mock').clone().removeClass('mock'),
		value = {};

	$form.find('input').each(function () {
		value[$(this).data('key')] = $(this).val();
	});


	$event.find('.type').text($form.attr('class'));
	$event.find('.value').text(JSON.stringify(value));

	$events.append($event);
	elementEventSave();
}


function elementEventRemove ()
{
	$(this).closest('li').remove();
	elementEventSave();
}

function elementEventMoveUp ()
{
	var $this = $(this).closest('li');
	$this.after($this.prev(':not(.mock)'));
	elementEventSave();
}

function elementEventMoveDown ()
{
	var $this = $(this).closest('li');
	$this.before($this.next(':not(.mock)'));
	elementEventSave();
}


function elementEventSave ()
{
	var square = $element.data('square'),
		side = $element.data('side'),
		events = [];

	$element.find('.events ul li:not(.mock)').each(function () {
		$event = $(this);
		events.push({
			type: $event.find('.type').text(),
			data: JSON.parse($event.find('.value').text())
		});
	});

	square.events[side]['on_walk'] = events;
}
