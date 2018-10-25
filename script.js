//------------------------------------Définition des variables----------------------------------------

//table
let ligne = 5;
let col = 10;
let cible = $("#cible");    //cible la table du HTML pour créer row et col
let html;                   //contient le code html pour créer la table
let damier = [];

//fourmis
let listeCouleurs = ["bleu", "rouge"]   //à ajouter égallement au CSS
let nombreFourmisTotal = 2;            //doit être divisible par le nombre de couleur 
let nombreFourmisParCouleur = nombreFourmisTotal / listeCouleurs.length;
let fourmisVivantes = [];
let fourmisMortes = [];

//durée de vie d'une fourmi : [ mini , maxi ]
let dureeDeVie = [30,35]

//accouplement
let ageMin = 5;
let ageMax = 25;
let delais = 2;
//----------------------generation de la table HTML et du damier (array) JS----------------------------------------

//Génération du code HTML
for (let i = 0; i < ligne; i++) {
    html += "<tr id=" + i + ">";
    damier.push([])
    for (let j = 0; j < col; j++) {
        damier[i].push(0);
        html += "<td class=" + j + "></td>";
    }
    html += "</tr>";
}

//Injection du code dans la page
cible.html(html);

//test pour cibler les cases
/* $("td").click(function () {
    let classe = $(this).attr("class");
    let id = $(this).parent().attr("id");
    console.log("ligne : " + id + " colone : " + classe)
}) */

//---------------------------------------------CLASSE----------------------------------------

class Fourmi {
    constructor(couleur, sexe = this.setSexe(), dureeDeVieMin = dureeDeVie[0], dureeDeVieMax = dureeDeVie[1]) {
        this.couleur = couleur;
        this.sexe = sexe;
        this.age = 0;
        this.ageMax = this.setAgeMax(dureeDeVieMin, dureeDeVieMax);
        this.morte = false;
        this.x;
        this.y;
    }
    setSexe(){
        let result = Math.floor(Math.random() * 2);
        if (result === 0) {
            return "F";
        }else{
            return "M";
        }
    }
    setAgeMax(dureeDeVieMin, dureeDeVieMax){
        let interval = dureeDeVieMax - dureeDeVieMin + 1;
        let result = dureeDeVieMin + Math.floor(Math.random() * interval);
        return result; 
    }
}

//--------------------------------------Génération des fourmis----------------------------------------

//pour chaque couleurs
for (let i = 0; i < listeCouleurs.length; i++) {
    //créer le nombre de fourmis par couleur
    for (let j = 0; j < nombreFourmisParCouleur; j++) {
        //avec au minimum un M et une F
        if (j === 0) {
            fourmisVivantes.push(new Fourmi(listeCouleurs[i], "F"));
        }else if (j === 1) {
            fourmisVivantes.push(new Fourmi(listeCouleurs[i], "M"));
        }else {
            fourmisVivantes.push(new Fourmi(listeCouleurs[i]));
        }
    }
}

//---------------------------------Positionnement initial des fourmis----------------------------------------

function positionInitial(fourmisAPlacer = fourmisVivantes, terrain = damier, nbLigne = ligne, nbCol = col) {
    // compte le nombre de fourmis en place
    let compteurFourmis = 0;
    //verifie qu'il y a suffisament d'emplacement
    if (fourmisAPlacer.length >= (terrain.length * terrain[0].length) ) {
        alert("Il y a trop de fourmis !")
    }else {
        while (compteurFourmis < fourmisAPlacer.length) {
            let ligne = Math.floor(Math.random() * nbLigne);
            let col = Math.floor(Math.random() * nbCol);
            if (terrain[ligne][col] === 0) {
                //place la fourmis sur le terrain
                $("#" + ligne + " > ." + col).attr("couleur", fourmisAPlacer[compteurFourmis].couleur );
                terrain[ligne][col] = fourmisAPlacer[compteurFourmis];
                //ajoute les coordonnées à la fourmi
                fourmisAPlacer[compteurFourmis].x = ligne;
                fourmisAPlacer[compteurFourmis].y = col;
                //incrémante le compteur
                compteurFourmis++;
            }
        }
    }

}
positionInitial();

//---------------------------------Déplacement des fourmis----------------------------------------

//retourne un bool si la fourmis est vivante et mofifie son age
function estVivante(fourmi) {
    if (fourmi.ageMax === fourmi.age) {
        fourmi.morte = true;
        return false;
    }else{
        fourmi.age ++;
        return true;
    }
}

//retourne un tableau de la nouvelle position [x, y]
function calculDeplacement(fourmi, terrain = damier){

    //dimensions du terrain
    xTerrainMin = 0;
    xTerrainMax = terrain.length -1;
    yTerrainMin = 0;
    yTerrainMax = terrain[0].length - 1;

    //position actuel de la fourmis
    let xActuel = fourmi.x;
    let yActuel = fourmi.y;

    //jet random pour futur position
    let xRandom = Math.floor(Math.random() * 3);
    let yRandom = Math.floor(Math.random() * 3);

    //définition du déplacement en fonction du random
    let xDeplace;
    let yDeplace;
    // x
    if (xRandom === 2) {
        xDeplace = -1;
    }else{
        xDeplace = xRandom;
    }
    // y
    if (yRandom === 2) {
        yDeplace = -1;
    } else {
        yDeplace = yRandom;
    }

    // calcul du déplacement sans tenir compte des bords
    let xCalculDeplacement = xActuel + xDeplace;
    let yCalculDeplacement = yActuel + yDeplace;

    //nouvelle position
    let xNouveau;
    let yNouveau;

    //vérification par rapport aux bords
    // x
    if (xCalculDeplacement > xTerrainMax) {
        xNouveau = xTerrainMin;
    } else if (xCalculDeplacement < xTerrainMin) {
        xNouveau = xTerrainMax;
    } else {
        xNouveau = xCalculDeplacement;
    }
    // y
    if (yCalculDeplacement > yTerrainMax) {
        yNouveau = yTerrainMin;
    } else if (yCalculDeplacement < yTerrainMin) {
        yNouveau = yTerrainMax;
    } else {
        yNouveau = yCalculDeplacement;
    }

    return [xNouveau, yNouveau];
}

function deplacement(vivantes = fourmisVivantes, mortes = fourmisMortes , terrain = damier){
    for (let i = 0; i < vivantes.length; i++) {

        //vérifie son age
        if(estVivante(vivantes[i])){

            // obtention des nouvelles coordonnées
            let nouvelleCoordonees = calculDeplacement(vivantes[i]);
            let x = nouvelleCoordonees[0];
            let y = nouvelleCoordonees[1];

            //verifie que la fourmi a changer de place
            if (x === vivantes[i].x && y === vivantes[i].y) {
                //ne fait rien
            }
            //verifie que l'emplacement est vide
            else if (terrain[x][y] === 0) {
                
                //déplace la fourmi sur la nouvelle place
                terrain[x][y] = vivantes[i];

                //efface l'ancienne position sur la page html
                $("#" + vivantes[i].x + " > ." + vivantes[i].y).removeAttr("couleur");

                //nettoye l'ancienne place
                terrain[vivantes[i].x][vivantes[i].y] = 0;

                //renseigne la nouvelle position à la fourmi
                terrain[x][y].x = x;
                terrain[x][y].y = y;

                //ajoute la nouvelle position sur la page html
                $("#" + x + " > ." + y).attr("couleur", vivantes[i].couleur);

            }
        }else{
            $("#" + vivantes[i].x + " > ." + vivantes[i].y).removeAttr("couleur");
            mortes.push(vivantes[i]);
            terrain[vivantes[i].x][vivantes[i].y] = 0;
            vivantes.slice(i, 1);
        }
    }

    //stop le set interval si il n'y a plus de fourmis
    if (vivantes.length === 0) {
        clearInterval(auto);
    }
}



var auto = setInterval(function () {
    deplacement();
    console.log(damier)
}, 1000);
