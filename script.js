

const modal = {
    open(){
        document.querySelector('.modal-overlay')
           .classList.add('active')
    },
    close(){
       document.querySelector('.modal-overlay')
           .classList
           .remove('active')
    }
} 
// somar as entrandas


const Storage={
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))|| []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
  
    
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()

    },
    remove(index){
        Transaction.all.splice(index,1)
        App.reload()

    },
    incomes(){
         // somar as entradas
        // verificar se a transaão é maior que zero
        // se for maior que zero 
        // somar a uma variavel e retonar a variavel
        let income = 0;
        Transaction.all.forEach(transaction => {

            if( transaction.amount >0  ){
             income += transaction.amount;
          }

        })
        return income; 
       } ,
    expenses(){
        //somar as saídas
        let expense =0;
        Transaction.all.forEach(transaction =>{

        if (transaction.amount < 0 ){
            expense +=transaction.amount;
        }

        })
        return expense;
    },
    total(){
        //entradas- saidas
        return Transaction.incomes() + Transaction.expenses();

    }

}

//eu preciso pegar minhas transacoes do obj e passar para html

const DOM = {
    transactionsContainer: document.querySelector('#data_table tbody'),
    addTransaction(transaction,index){
        const tr= document.createElement('tr')
        tr.innerHTML= DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index=index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index){
        const CSSclass= transaction.amount > 0 ? "income":"expense"

        const amount= Utils.formatcurrency(transaction.amount)
        
        const html=`
        <tr>
                        <td class="description">${transaction.description}</td>
                        <td class="${CSSclass}">${amount}</td>
                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover Transações">
                        </td>
                    </tr>
                    `

                    return html
    },
    updateBalance(){
        document
        .getElementById('incomeDisplay')
        .innerHTML= Utils.formatcurrency(Transaction.incomes())
        document
        .getElementById('expenseDisplay')
        .innerHTML= Utils.formatcurrency(Transaction.expenses())
        document
        .getElementById('totalDisplay')
        .innerHTML= Utils.formatcurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML=""

    }
}
const Utils={
    formatAmout(value){
        value= Number(value) * 100
        
        return value

    },
    formatDate(date){
        const splittedDate= date.split("-"  )
         return  `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatcurrency(value){
        const signal= Number(value) <0? "-":""

        value = String(value).replace(/\D/g,"")
         value = Number(value)/100

         value= value.toLocaleString("pt-BR",{
             style:"currency",
             currency:"BRL"
         })

        return signal + value

    }
}

const Form={
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount:Form.amount.value,
            date:Form.date.value
        }
    },
    
     validadeFields(){
         const{description,amount,date}= Form.getValues()
         if(description.trim()===""|| 
           amount.trim()===""||
           date.trim()===""){
               throw new Error("Por favor , preencha todos os campos")
           }
       
    },

    formatValues(){
       let {description,amount,date}= Form.getValues()
       amount= Utils.formatAmout(amount)

       date= Utils.formatDate(date)
       return{
           description,
           amount,
           date
       }
    },
    clearFields(){
        Form.description.value=""
        Form.amount.value=""
        Form.date.value=""
    },
    
    submit(event){
        event.preventDefault()
        //verificar se todas informaçoes foram prenchidas
       
        try{ 
            Form.validadeFields()
         //formatar os dados salvar
       // Form.formatData()
       const transaction = Form.formatValues()
    
        //salvar
        Transaction.add(transaction)
    


        //apagar os dados do fomulario
            Form.clearFields()

        //modal feche
            modal.close()




        } catch(error){
            alert(error.message)

        }
      
    }
}
const App ={
    init(){
        Transaction.all.forEach((transaction, index)=>{
            DOM.addTransaction(transaction,index)
        })
        
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()



