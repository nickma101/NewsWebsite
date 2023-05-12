# react-modal-wrapper

A React Modal Wrapper that uses FlexBox to keep it's position, BYOM (bring-your-own-modal). Based off the [Portal component](https://github.com/tajo/react-portal) by [Tajo](https://github.com/tajo).
**Note:** This uses flexbox so browser support is iffy. Will post a compatibility table at some point.

## Installation
```
npm install react-modal-wrapper --save
```

## Usage
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import FlexModalWrapper from 'react-modal-wrapper';
import 'react-modal-wrapper/dist/main.css'; // to load default styles

const Modal = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
        <p><button onClick={this.props.closeModal}>Close this</button></p>
      </div>
    );
  }
});

let App = React.createClass({
  render() {
    const button = <button>Open Modal</button>;
    return (
      <div className="example">
        <FlexModalWrapper className="modal" closeOnEsc closeOnOutsideClick openByClickOn={button}>
          <Modal>
            <h2>Modal</h2>
            <p>this react component is appended to the document body</p>
          </Modal>
        </FlexModalWrapper>
      </div>
    );
  }
});

ReactDOM.render(<App/>, document.getElementById('container'));
```
With accompanying CSS:
```css
.modal {
  background-color: #fff;
  border: 1px solid #000;
  box-shadow: 0 3px 9px rgba(0,0,0,0.5);
  padding: 25px;
}
```

## Documentation
#### children : `React.PropTypes.element.isRequired`
The modal expects a single child which is the modal component that you provide.
#### isOpened : `React.PropTypes.bool`
If `true`, the modal will be open, if `false`, the modal will be closed. You have to manage closing it (via state management) so to make life easier see `openByClickOn`
#### openByClickOn : `React.PropTypes.element`
Renders the passed element where you actually use the `FlexModalWrapper` (see example above). It's `onClick` handler opens the modal. The prop `closeModal` gets passed into your Modal so you can call `this.props.closeModal` to close the modal.
#### closeOnEsc : `React.PropTypes.bool`
If `true`, the modal can be closed by pressing the ESC key.
#### closeOnOutsideClick : `React.PropTypes.bool`
If `true`, the modal can be closed by click anywhere outside the modal.
#### onClose : `React.PropTypes.func`
Callback that is called when the portal closes.
#### className : `React.PropTypes.string`
The class that gets set to the element that wraps your modal. **Note:** this is where you'll want to set `box-shadow` CSS since it wraps your modal with exactly the same dimensions, any `box-shadow` on your modal won't show passed the borders of the wrapping element so the `box-shadow` would appear to just be a black line typically.
#### useOverlay : `React.PropTypes.bool` (defaults to `true`)
If `true`, will use an overlay that gets placed behind the modal. Will use default style or use passed `overlayStyle` or `overlayClassName` for the overlay style.
#### overlayStyle : `React.PropTypes.object`
Object that will be used as inline styles for the overlay (only if `useOverlay` is `true`)
#### overlayClassName : `React.PropTypes.string`
String that will be used as the class for the overlay (only if `useOverlay` is `true`)

## Testing and Examples
You can test the examples by running
```
npm start
```
and then going to `localhost:8080/basic/` in your browser. There'll be buttons for different modals

To test run
```
npm test
```
**Note:** Tests are not yet implemented
