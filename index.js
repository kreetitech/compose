module.exports = Compose = {
  create: function(stack) {
    this.stack = stack;
    this.listen = function(req, resp) {
      var o = new this.new(req, resp);
      o.next();
    }

    this.new = function(req, resp) {
      this.compose = {stack: stack, stack_counter: -1}
      this.next() = function() {
	this.compose.stack_counter++;
	if(this.compose.stack_counter < this.compose.stack.length)
	  this.compose.stack[this.compose.stack_counter].call(this, req, resp);
      }
      return this;
    }
    return this;
  }
};
