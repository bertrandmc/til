const scaleNames = {
  'f': 'Fahrenheit',
  'c': 'Celsius'
};

function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function tryConvertion(value, converter) {
  value = parseFloat(value);
  if (Number.isNaN(value)) {
    return '';
  }
  value = converter(value);
  return Math.round(value * 1000) / 1000;
}

function TemperatureInput (props) {
  const { label, value, handleChange} = props;
  return (
    <fieldset>
      <label>{label}</label>
      <input type="text" value={value} onChange={e => handleChange(e.target.value)} />
    </fieldset>
  );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = { scale: 'f' };
  }

  handleFareheightChange = (value) => {
    this.setState({scale: 'f', temperature: value});
  };

  handleCelsiusChange = (value) => {
    this.setState({scale: 'c', temperature: value});
  };

  handleScaleChange = (event) => {
    this.setState({scale: event.target.value});
  };

  render() {
    const { temperature, scale } = this.state;
    const celsius = (scale === 'f') ? tryConvertion(temperature, fahrenheitToCelsius) : temperature;
    const fareheight = (scale === 'c') ? tryConvertion(temperature, celsiusToFahrenheit) : temperature;

    return (
      <div className="temperature-converter">
        <h3>Temperature Converter</h3>
        <p>Please enter temperature:</p>

        <div className="temperature-converter__inputs">
          <TemperatureInput
            label="Fareheight"
            value={fareheight}
            handleChange={this.handleFareheightChange}/>

          <TemperatureInput
            label="Celsius"
            value={celsius}
            handleChange={this.handleCelsiusChange}/>
        </div>

      </div>
    );
  }
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
