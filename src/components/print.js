module.exports = (name) => {
	var el = document.createElement('div');
	el.innerHTML += 'Hi' + name; 
	el.innerHTML += '<img src="http://via.placeholder.com/3000x1500">';
	return el;
};
