class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
     /**
     * @param {*} val
     * @return {SinglyLinkedList}
     */
    push(val) {
        const newNode = new Node(val);
        //Check if this node is the first element in the linkedList
        if(!this.head) {
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
        return this;
    }
    traverse() {
        var current = this.head;
        while(current) {
            console.log(current.value);
            current = current.next;
        }
    }
    /**
     * @return {Node}
     */
    pop() {
        if(!this.head) return undefined;
        var current = this.head;
        var newTail = current;
        while(current.next !== null) {
            newTail = current;
            current = current.next;
        }
        newTail.next = null;
        this.tail = newTail;
        this.length--;
        if(this.length === 0) {
            this.head = null;
            this.tail = null;
        }
        return current;
    }
    /**
     * @return {Node}
     */
    shift() {
        if(!this.head) return undefined;
        var currentHead = this.head;
        this.head = currentHead.next;
        this.length--;
        if(this.length === 0) this.tail = null;
        currentHead.next = null;
        return currentHead;
    }
    /**
     * @param {*} val
     * @return {SinglyLinkedList}
     */
    unshift(val) {
        var newNode = new Node(val);
        if(!this.head) {
            this.head = newNode;
            this.tail = this.head;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.length++;
        return this;
    }
    /**
     * @param {*} index
     * @return {Node}
     */
    get(index) {
        if(index < 0 || index >= this.length) return null;
        var counter = 0;
        var current = this.head
        while(counter !== index) {
            current = current.next;
            counter++;
        }
        return current;
    }
    /**
     * @param {*} index
     * @param {*} value
     * @return {Boolean}
     */
    set(index, value) {
        var node = this.get(index);
        if(!node) return false;
        node.value = value;
        return true;
    }
     /**
     * @param {*} index
     * @param {*} value
     * @return {Boolean}
     */
    insert(index, value) {
        if(index < 0 && index > this.length) return false;
        if(index === 0) return !!this.unshift(value);
        else if(index === this.length) return !!this.push(value);
        else {
            var previousNode = this.get(index - 1);
            var newNode = new Node(value);
            newNode.next = previousNode.next;
            previousNode.next = newNode;
            this.length++;
            return true;
        }
    }
     /**
     * @param {*} index
     * @return {Boolean}
     */
    remove(index) {
        if(index < 0 && index >= this.length) return undefined;
        if(index === 0) return this.shift();
        else if(index === this.length - 1) return this.pop();
        else {
            var previousNode = this.get(index - 1);
            var removedNode = previousNode.next;
            previousNode.next = removedNode.next;
            removedNode.next = null;
            this.length--;
            return removedNode;
        }
    }
    /**
     * @return {SinglyLinkedList}
     */
    reverse() {
        var current = this.head, prev = null, next = null;
        while(current) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.tail = this.head;
        this.head = prev;
        return this;
    }
    /**
     * @return {SinglyLinkedList}
     */
    swapPairs() {
        var current = this.head;
        function swapRecursiveHelper(node) {
            if(!node || !node.next) return node;
            var newHead = node.next;
            node.next = swapRecursiveHelper(newHead);
            newHead.next = node;
            return newHead;
        }
        return swapRecursiveHelper(current);
    }
}

export default SinglyLinkedList;