function $(x){ return document.getElementById(x); }

const canvas = $('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const draw = canvas.getContext('2d');

//accepts an axiom string, rule string, and library of rules to definitions
//defs map a rule letter to a length, angle, thickness, and color
class Tree {
    constructor(axiom, rules, library, falloff){
        this.axiom = axiom;
        this.rules = rules;
        this.library = library;
        this.falloff = falloff;
    }

    render(tree){
        console.log('rendering...')
        const canv = $('canvas');
        const ctx = canv.getContext('2d');
        ctx.resetTransform();
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.transform(1, 0, 0, 1, canv.width / 2, canv.height);
        let lastI = 0
        let curI = 0;
        for(let i = 0; i < tree.length; i++){
            if(tree.charAt(i) == '['){
                ctx.save();
                lastI = curI;
            } else if(tree.charAt(i) == ']'){
                ctx.restore();
                curI = lastI;
            } else {
                let curRule = this.library[tree.charAt(i)];
                ctx.rotate(curRule[1] * Math.PI / 180);
                if(tree.charAt(i) == 'F'){
                    ctx.fillStyle = curRule[3];
                    ctx.fillRect(0, curRule[2] / 2, curRule[2], -curRule[0] * (Math.pow(falloff, curI + 1)));
                    ctx.transform(1, 0, 0, 1, 0, -curRule[0] * (Math.pow(falloff, curI + 1)));
                    curI++;
                }
            }
        }
    }

    buildTree(iterations){
        let output = this.axiom;
        for(let i = 0; i < iterations; i++){
            output += this._applyRule(output);
        }
        return output;
    }

    _applyRule(axiom){
        let output = '';
        for(let i = 0; i < axiom.length; i++){
            console.log(this.rules);
            let swapIn = this.rules[axiom.charAt(i)];
            if(swapIn){
                output += swapIn;
            } else {
                output += axiom.charAt(i);
            }
        }
        return output;
    }

    _createLibraryDef(chars, evolution){
        let output = {};
        for(let char in chars){
            output[char] = evolution[chars.indexOf(char)];
        }
        return output;
    }

    _constructLibrary(allChars, attributes){
        
    }

    _constructRulesFromString(input){
        let output = {};
        let chunks = input.split(',');
        for(let i = 0; i < chunks.length; i += 2){
            output[chunks[i]] = chunks[i + 1];
        }
        return output;
    }

}

const tree = new Tree();
const falloff = 0.98

$('generate').addEventListener("click", treeFromInputs);

function treeFromInputs(){
    console.log("Working...")
    let rules = tree._constructRulesFromString($('rule').value);
    let axiom = $('axiom').value;
    let library = {
        'C': [0, $('angle').value, $('thickness').value, $('color').value],
        'F': [$('length').value, 0, $('thickness').value, $('color').value],
        'c': [0, -$('angle').value, $('thickness').value, $('color').value],
    }
    let newTree = new Tree(axiom, rules, library, falloff);
    let iterations = $('iterations').value;
    let param = newTree.buildTree(iterations);
    console.log(param);
    newTree.render(param);
}