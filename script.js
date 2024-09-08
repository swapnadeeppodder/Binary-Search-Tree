
const SECOND = 1000;
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const parseArrayInput = (inputStr) => {
    const tokens = inputStr.trim().split(/\s+/);
    const array = tokens.map(elem => parseFloat(elem));
    if(array.length !== tokens.length || array.some(elem => isNaN(elem)))
        return null;
    return array;
}
const newNodeElement = (value) => {
    const elem = document.createElement('div');
    elem.className = 'tree-wrapper';
    elem.innerHTML = `<div class="node-wrapper"><div class="node">${value}</div></div>`;
    return elem;
}
const insertNewValue = async (tree, newValue) => {
    const currentNode = tree.querySelector(':scope > .node-wrapper > .node')
    console.log(currentNode);
    const currentValue = Number(currentNode.innerHTML);
    currentNode.innerHTML = newValue > currentValue ? `${newValue} > ${currentValue}` : `${newValue} &#8804 ${currentValue}`;
    currentNode.classList.add('compared')
    await sleep(1.6 * SECOND);
    currentNode.innerText = currentValue;
    currentNode.classList.remove('compared');

    if(newValue > currentValue && !tree.querySelector(':scope > .right')) {
        tree.insertAdjacentHTML('beforeend', '<div class="right"></div>');
        tree.lastElementChild.insertAdjacentElement('beforeend', newNodeElement(newValue));
        tree.firstElementChild.insertAdjacentHTML('beforeend', '<svg class="edge right-edge"><line x1="0" y1="0" x2="100%" y2="100%"></line></svg>');
        await sleep(SECOND);
    }
    else if(newValue > currentValue) {
        await insertNewValue(tree.querySelector(':scope > .right > .tree-wrapper'), newValue);
    }
    else if(!tree.querySelector(':scope > .left')) {
        tree.insertAdjacentHTML('beforeend', '<div class="left"></div>');
        tree.lastElementChild.insertAdjacentElement('beforeend', newNodeElement(newValue));
        tree.firstElementChild.insertAdjacentHTML('beforeend', '<svg class="edge left-edge"><line x1="0" y1="100%" x2="100%" y2="0"></line></svg>')
        await sleep(SECOND);
    }
    else {
        await insertNewValue(tree.querySelector(':scope > .left > .tree-wrapper'), newValue);
    }
}
const buildBST = async () => {
    const array = parseArrayInput(document.getElementById('array-input').value);
    if(!array){
        document.getElementById('input-error').innerHTML = 'Incorrect input!';
        return;
    }
    const root = newNodeElement(array[0]);
    const bst = document.getElementById('bst')
    bst.innerHTML = '';
    bst.insertAdjacentElement('beforeend', root);
    await sleep(SECOND);

    for(let i = 1;i < array.length;i++)
        await insertNewValue(root, array[i]);
}
document.getElementById('submit-array').addEventListener('click', buildBST)
