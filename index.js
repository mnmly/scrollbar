/**
 * Module dependencies
 */
var domify   = require( 'domify' ),
    css      = require( 'css' ),
    events   = require( 'events' ),
    template = require( './template' );

/**
 * Expose `Scrollbar`
 */

module.exports = Scrollbar;

/**
 * Initialize `Scrollbar`
 *
 * @param {Element} el Element to attach scroll bar
 */

function Scrollbar( el ) {
  
  if( !( this instanceof Scrollbar ) ) return new Scrollbar( el );
  if( !el ) throw new TypeError( 'element is required' );
  
  this.el        = el;
  this.scrollTop = 0;
  this.container = domify( template )[0];
  this.view      = this.container.querySelector( '.view' );
  this.thumb     = this.container.querySelector( '.thumb' );
  this.width     = this.el.clientWidth,
  this.height    = this.el.clientHeight,

  this.el.parentNode.insertBefore( this.container, this.el );
  this.view.appendChild( this.el );
  this.setupStyles();
  
  this.bind();
}

/**
 * Setup dom styles
 *
 * @api private
 */

Scrollbar.prototype.setupStyles = function( ) {
  
  css( this.container, {
    width: this.width
  } );

  css( this.view, {
    width:  this.width,
    height: this.height
  } );

  css( this.el, {
    width:    'auto',
    height:   'auto',
    position: 'relative'
  } );
  
  this.updateHeight();
  css( this.thumb, {
    height: this.thumbHeight,
  } );

  if ( this.thumbHeight > this.el.clientHeight ){
    this.container.classList.add( 'no-scroll' )
  }
};


/**
 * Bind DOM Events
 *
 * @api private
 */

Scrollbar.prototype.bind = function( ) {
  events( this.container, this ).bind( 'mousewheel' );
};

/**
 * Updates the height
 *
 * For the case where length of content dynamically changes.
 *
 * @api public
 */

Scrollbar.prototype.updateHeight = function( ) {
  this.scrollHeight = this.view.scrollHeight;
  this.thumbHeight  = Math.round( this.height / this.scrollHeight * this.height );
};

/**
 * Mousewheel event handler
 *
 * Updates scroll position, and thumb position.
 *
 * @api private
 */

Scrollbar.prototype.onmousewheel = function( e ) {
  var bottom;
  this.scrollTop -= e.wheelDelta / 120 * 40;
  bottom = this.scrollHeight - this.height;
  if( this.scrollTop < 0 ){      this.scrollTop = 0; }
  if( this.scrollTop > bottom ){ this.scrollTop = bottom; }

  css( this.thumb, {
    top: Math.round( this.scrollTop / this.scrollHeight * ( this.height ) )
  } );

  this.el.style.top = -this.scrollTop + 'px';
};