const budgetController = (() =>{
   
    const Despesa = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp:0,
            inc:0
        },
        budget : 0
    }

    const calculateTotal = (type) =>{
        let soma =0
        data.allItems[type].forEach(index =>{
            soma += index.value
        })
        data.totals[type] = soma
        
    }

    return {
        addItem: (type, des, val)=>{
            let newItem, ID

            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1 
            }else{
                ID = 0
            }           
            newItem = new Despesa(ID, des, val)  
            data.allItems[type].push(newItem)           
            return newItem
                
        },
        deleteItem: (type,id)=>{
            id = parseInt(id)
            var ids = data.allItems[type].map(current =>{
                return current.id
                
            })
            
            const index = ids.indexOf(id)

            if (index !== -1){
                data.allItems[type].splice(index,1)
                
            }


        },
        calculeteBudget : () =>{

            calculateTotal('inc')
            calculateTotal('exp')
            data.budget = data.totals.inc - data.totals.exp
            UIController.domValues(data.budget, data.totals.inc, data.totals.exp)

        }
        }
    
})()


const UIController = (() =>{

    const Strings = {
        inputType: '.select',
        inputDesc: '.desc',
        inputValue: '.valor',
        Btn: '.add',
        bottom: '.bottom'


    }
    return {
        getInput :()=>{
            return{
                type: document.querySelector(Strings.inputType).value,
                description : document.querySelector(Strings.inputDesc).value,
                value :parseFloat(document.querySelector(Strings.inputValue).value)

            }
        },
        addItemsDom :(obj, type) =>{
            const container =`.${type}`
            const inc = 'inc'
            const innerhtml = `
            <div class="lista" id=${type}-${obj.id}>
            <p>${obj.description}</p>
            <div class="itens">
                <p> ${type === inc ? `+`:`-`} ${Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(obj.value)}</p>
                <button><ion-icon name="trash-outline"></ion-icon></button>
            </div>    
            </div> `

            document.querySelector(container).insertAdjacentHTML('beforeend',innerhtml)
            
        },

        deleteItemDom:(selectId) =>{
            const id = document.getElementById(selectId)
            
            id.parentNode.removeChild(id)



        },

        
        clearInputs :() =>{
            const inputs = document.querySelectorAll('input')
            inputs.forEach(input =>{
                input.value = ""
            })
            inputs[0].focus()

        },
        domValues: (despesa, renda, gastos) =>{
            document.querySelector('.despesas h2').textContent =Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(despesa)
            document.querySelector('.renda .value h2').textContent = Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(renda)
            document.querySelector('.gastos .value h2').textContent = Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(gastos)
            

        },

        getStrings : () =>{
            return Strings
        }
    }



})()

const controller = ((budgetCtrl, UICtrl)=>{

    
    const add = ()=>{
        const items = UICtrl.getInput()

        if (items.description !== "" && !isNaN(items.value) && items.value >0){
            const newitem = budgetCtrl.addItem(items.type, items.description, items.value)
            UICtrl.addItemsDom(newitem, items.type)
            UICtrl.clearInputs()
            budgetCtrl.calculeteBudget()        
            
        }         
       
    }

    

    const ctrlDeleteItem = (e) =>{
        const ItemId= e.target.parentNode.parentNode.parentNode.id

        if (ItemId){

            const splitID = ItemId.split('-')
            const type = splitID[0]
            const ID = splitID[1]
            budgetCtrl.deleteItem(type, ID)
            budgetCtrl.calculeteBudget()
            UIController.deleteItemDom(ItemId)


        }




    }

    const setup = () =>{
        const Strings = UIController.getStrings()
        document.querySelector(Strings.Btn).addEventListener('click', add)
        document.querySelector(Strings.bottom).addEventListener('click', ctrlDeleteItem)
        document.addEventListener('keypress', (e)=>{

    if (e.key ==="Enter"){
        add()

    }})}


    return {
        init:()=>{
            console.log("Aplicação Iniciada")
            setup()
            UICtrl.domValues(0,0,0)
            
        }}

})(budgetController,UIController)

controller.init()