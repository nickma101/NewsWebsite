React-body-subtree
============
**Note** This is a fork of [react-portal](https://github.com/tajo/react-portal) that fits more to our needs. Development and functionality may divert from the original package to address these concerns.

> React-body-subtree is a react component that, instead of rendering it's children as a subtree in it's current render path, it renders it's children as a new React subtree within `<body>`. This is useful for modals and the like.

## Features

- transports its child into a new React component and appends it to the **document.body** (creates a new independent React tree)
- can be opened by the prop **isOpened**
- can be opened after a click on an element that you pass through the prop **openByClickOn** (and then it takes care of the open/close state)
- doesn't leave any mess in DOM after closing
- provides its child with **this.props.closePortal** callback
- provides **close on ESC** and **close on outside mouse click** out of the box
- supports absolute positioned components (great for tooltips)
- **no dependencies**
- **fully covered by tests**

## Demo

```shell
git clone https://github.com/1stdibs/react-body-subtree
cd react-body-subtree
npm install
npm run build:examples
open examples/index.html
```

## Installation

```shell
npm install react react-dom react-body-subtree --save
```

## Usage
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import BodySubtree from 'react-body-subtree';

export default class App extends React.Component {

  render() {
    const button1 = <button>Open portal with pseudo modal</button>;

    return (
      <BodySubtree closeOnEsc closeOnOutsideClick openByClickOn={button1}>
        <PseudoModal>
          <h2>Pseudo Modal</h2>
          <p>This react component is appended to the document body.</p>
        </PseudoModal>
      </BodySubtree>
    );
  }

}

export class PseudoModal extends React.Component {

  render() {
    return (
      <div>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('react-body'));
```
## Documentation - props

### Always required

#### children : ReactElement
The portal expects one child (`<Portal><Child ... /></Portal>`) that will be ported.

### One of these two required

#### isOpened : bool
If true, the component will be rendered to `<body>`. If false, it will be unmounted. It's up to you to take care of the closing (aka taking care of the state). Don't use this prop if you want to make your life easier. Use openByClickOn instead!

#### openByClickOn : ReactElement
The second way how to open the portal. This element will be rendered by the portal immediately
with `onClick` handler that triggers portal opening. **How to close the portal then?** The portal provides its ported child with a callback `this.props.closePortal`. Or you can use built-in portal closing methods (closeOnEsc, ... more below). Notice that you don't have to deal with the open/close state (like when using the `isOpened` prop).

### Optional

#### closeOnEsc: bool
If true, the portal can be closed by the key ESC.

#### closeOnOutsideClick: bool
If true, the portal can be closed by the outside mouse click.

#### onOpen: func(DOMNode)
This callback is called when the portal is opened and rendered (useful for animating the DOMNode).

#### beforeClose: func(DOMNode, removeFromDOM)
This callback is called when the closing event is triggered but it prevents normal removal from the DOM. So, you can do some DOMNode animation first and then call removeFromDOM() that removes the portal from DOM.

#### onClose: func
This callback is called when the portal closes and after beforeClose.

#### onUpdate: func
This callback is called when the portal is (re)rendered.


## Tips & Tricks
- Does your modal have a fullscreen overlay and the `closeOnOutsideClick` doesn't work? [There is a simple solution](https://github.com/tajo/react-portal/issues/2#issuecomment-92058826).
- Does your inner inner component `<LevelTwo />`

```jsx
<Portal>
  <LevelOne>
    <LevelTwo />
  </LevelOne>
</Portal>
```

also needs an access to `this.props.closePortal()`? You can't just use `{this.props.children}` in render method of `<LevelOne>` component. You have to clone it instead:

```jsx
{React.cloneElement(
  this.props.children,
  {closePortal: this.props.closePortal}
)}
```

#### Open modal programmatically

Sometimes you need to open your portal (e.g. modal) automatically. There is no button to click on. No problem, because the portal has the `isOpen` prop, so you can just set it to `true` or `false`. However, then it's completely up to you to take care about the portal closing (ESC, outside click, no `this.props.closePortal` callback...).

However, there is a nice trick how to make this happen even without `isOpen`:

```jsx
<Portal ref="myPortal">
  <Modal title="My modal">
    Modal content
  </Modal>
</Portal>
```

```jsx
this.refs.myPortal.openPortal()
// opens the portal, yay!
```

**Don't forget to run this before every commit:**

```
npm test
```

## Credits

- [react-portal](https://github.com/tajo/react-portal) originally inspired by the talk [React.js Conf 2015 - Hype!, Ryan Florence](https://www.youtube.com/watch?v=z5e7kWSHWTg) and written by Vojtech Miksu 2015, [miksu.cz](https://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)
