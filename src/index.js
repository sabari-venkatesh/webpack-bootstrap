import print from './components/print';
import './styles/main.css';
import './styles/index.scss';

let emp = {
  "test": 1,
	"name": "venkatesh",
	"id": "628"
};

var printName = ({
	name
}) => {
	document.body.appendChild(print(name));
}

printName(emp);