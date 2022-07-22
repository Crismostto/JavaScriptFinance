/**  
*  Clases.
**/ 
class Ingreso {
    constructor(nombre,monto,fecha){
    this.nombre = nombre;
    this.monto = monto;
    this.fecha = fecha;
    }
}

class Gasto {
    constructor(nombre,monto,fecha){
    this.nombre = nombre;
    this.monto = monto;
    this.fecha = fecha;
    }
}


/**  
*  Funciones.
**/ 


/*Busca datos a la API de dolar*/
async function getDolar() {
    const apiUSD = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
    const cotizacionDolar = await fetch(apiUSD);
    const cotizacionJSON = await cotizacionDolar.json();
    return cotizacionJSON
    
  }

/*Carga del local storage al principio en la vista de tablas*/
window.addEventListener("load", () => {
  if (TodosIngresos.length > 0) {
    mostrarIngresosGastos('ingreso',TodosIngresos)
  } 
  
  if (TodosGastos.length > 0){
    mostrarIngresosGastos('gasto',TodosGastos)
  }

  calcularBalanceGeneral();
})

//Se genera un ingreso o gasto. 
function generarIngresoGasto(tipo, nombre, monto, fecha){
    
    if (tipo=="ingreso"){
        
        nuevoIngreso = new Ingreso(nombre,monto,fecha);
        TodosIngresos.push(nuevoIngreso);
    }else
    {
        if (tipo =='gasto'){
           
            nuevoGasto = new Gasto(nombre,monto,fecha);
            TodosGastos.push(nuevoGasto);
        };
    }

}

//Se genera un la interfaz o gasto. 
function mostrarIngresosGastos(tipo,array){

    
    if(tipo=="ingreso"){
        let tablaIngresoRef= document.getElementById("tbodyIngresos");
        tablaIngresoRef.innerHTML= "";
        
        array.map( (el,index) => tablaIngresoRef.innerHTML += `
                                                        
                                                                <tr id="${el.nombre}">
                                                                <td>${index+1}</td>
                                                                <td>${el.nombre}</td>
                                                                <td>${el.monto}</td>
                                                                <td>${el.fecha}</td>
                                                                </tr>
                                                                
                                                            `
        )
    }else if(tipo=="gasto"){
        let tablaGastoRef= document.getElementById("tbodyGastos");
        
        
        tablaGastoRef.innerHTML= "";
        
        array.map( (el,index) => tablaGastoRef.innerHTML += `
                                                        
                                                                <tr id="${el.nombre}">
                                                                <td>${index+1}</td>
                                                                <td>${el.nombre}</td>
                                                                <td>${el.monto}</td>
                                                                <td>${el.fecha}</td>
                                                                </tr>
                                                                
                                                            `
        )
    }
}


//Calculo de balance general.
function calcularBalanceGeneral(){
    let ingresoTotales=0
    for (let ingreso of TodosIngresos){
     ingresoTotales = ingreso.monto + ingresoTotales
   }
   
   let gastoTotales=0
    for (let gasto of TodosGastos){
     gastoTotales = gasto.monto + gastoTotales
   }
   
   let total= ingresoTotales - gastoTotales;

   if (total<0){
     let balanceNegativo = document.getElementById("divBalanceGeneral")
     balanceNegativo.className = "alert alert-danger";
   }else{
    let balancePostivo = document.getElementById("divBalanceGeneral")
    balancePostivo.className = "alert alert-primary";
   }

   let balanceGeneralRef= document.getElementById("montoBalanceGeneral");
   balanceGeneralRef.textContent= total;
}





/*Begin*/
const TodosIngresos= JSON.parse( localStorage.getItem("Ingresos")) || [];
const TodosGastos= JSON.parse( localStorage.getItem("Gastos")) || [];

/*Luxon*/
const DateTime = luxon.DateTime;

/**
* Seccion Ingresos
**/ 
let countIngresos=0
let btnIngreso = document.getElementById("btnIngreso");
btnIngreso.addEventListener('click', function(){
    
    countIngresos=countIngresos+1
    
    let nombreIngreso= document.getElementById("nombreIngreso").value;
    let montoIngreso= parseInt(document.getElementById("montoIngreso").value); 
    let dt = DateTime.now()
    dt= dt.toLocaleString()
    generarIngresoGasto('ingreso',nombreIngreso,montoIngreso,dt)


    /*Se guarda en localStorage*/
    localStorage.setItem("Ingresos", JSON.stringify(TodosIngresos))

     /*Se genera la interfaz de la tabla de gastos*/
     mostrarIngresosGastos('ingreso',TodosIngresos); 

    //Finalizada la carga se calcula el balance general
    calcularBalanceGeneral();
});


/** 
* Seccion Gastos
**/
let countGastos=0
let btnGasto = document.getElementById("btnGasto");
btnGasto.addEventListener('click', function(){
    countGastos=countGastos+1
    let nombreGasto= document.getElementById("nombreGasto").value;
    let montoGasto= parseInt(document.getElementById("montoGasto").value);
    let dt = DateTime.now()
    dt= dt.toLocaleString()
    generarIngresoGasto('gasto',nombreGasto,montoGasto,dt)
 
    /*Se guarda en localStorage*/
    localStorage.setItem("Gastos", JSON.stringify(TodosGastos))

    /*Se genera la interfaz de la tabla de gastos*/
    mostrarIngresosGastos('gasto',TodosGastos); 

    //Finalizada la carga se calcula el balance general
    calcularBalanceGeneral();
});


/** 
* Seccion consumo API cotizaciones del dolar.
**/ 

/*NO ME FUNCIONA NO SE POR QUÉ */
// urlDolar= 'https://cors-solucion.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolarblue';
 let lista = document.getElementById("listadoUsd");
 let monedas = document.getElementById("mostrarCotizaciones");
 monedas.addEventListener('click', async ()=>{
    
        try {
            const dolar= await getDolar()
            console.log(dolar);
            dolar.forEach(e => {
                const li = document.createElement('li')
                li.innerHTML = `
                                <h4>${e.casa.nombre}</h4>
                                <p>Compra: ${e.casa.compra}</p>
                                <p>Venta: ${e.casa.venta}</p>
                              `
                lista.append(li);              
            });
        } catch (error) {
            console.log(error);
        }
    
        
 } )



