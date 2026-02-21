function getProduits() {
    return JSON.parse(localStorage.getItem("produits")) || [];
}

function saveProduits(data) {
    localStorage.setItem("produits", JSON.stringify(data));
}

function ajouterProduit() {

    let nom = document.getElementById("nom").value;
    let quantite = parseInt(document.getElementById("quantite").value);
    let prix = parseFloat(document.getElementById("prix").value);
    let type = document.getElementById("type").value;

    if(nom === "" || isNaN(quantite) || isNaN(prix)){
        alert("Remplir tous les champs !");
        return;
    }

    let produits = getProduits();
    let produitExiste = produits.find(p => p.nom === nom);

    if(produitExiste){
        if(type === "entree"){
            produitExiste.quantite += quantite;
        } else {
            produitExiste.quantite -= quantite;
            if(produitExiste.quantite < 0){
                alert("Stock insuffisant !");
                return;
            }
        }
    } else {
        produits.push({nom, quantite, prix});
    }

    saveProduits(produits);
    alert("Mouvement enregistré !");
    window.location.href="produits.html";
    let historique = getHistorique();

historique.push({
    nom: nom,
    type: type,
    quantite: quantite,
    date: new Date().toLocaleString()
});

saveHistorique(historique);

}

function afficherProduits() {

    let produits = getProduits();
    let table = document.getElementById("listeProduits");

    let stockTotal = 0;
    let valeurTotale = 0;

    table.innerHTML = "";

    produits.forEach((p,index)=>{
        let total = p.quantite * p.prix;
        stockTotal += p.quantite;
        valeurTotale += total;

        table.innerHTML += `
        <tr>
        <td>${p.nom}</td>
        <td>${p.quantite}</td>
        <td>${p.prix}</td>
        <td>${total}</td>
        </tr>
        `;
    });

    if(document.getElementById("stockTotal")){
        document.getElementById("stockTotal").innerText = stockTotal;
        document.getElementById("valeurTotale").innerText = valeurTotale;
    }

    genererGraphique(produits);
}


function genererGraphique(produits){

    if(!document.getElementById("stockChart")) return;

    let noms = produits.map(p=>p.nom);
    let quantites = produits.map(p=>p.quantite);

    new Chart(document.getElementById("stockChart"), {
        type: 'bar',
        data: {
            labels: noms,
            datasets: [{
                label: "Quantité en stock",
                data: quantites
            }]
        }
    });
}

function getHistorique(){
    return JSON.parse(localStorage.getItem("historique")) || [];
}

function saveHistorique(data){
    localStorage.setItem("historique", JSON.stringify(data));
}
