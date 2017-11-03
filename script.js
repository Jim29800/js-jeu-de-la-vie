var ligne = 12;
var col = 50;
var tableau = [];
//generation du tableau HTML et JS
var cible = $("#cible");
var html;
for (var i = 0; i < ligne; i++) {
    html += "<tr id="+i+">";
    tableau.push([])
    for (var j = 0; j < col; j++) {
        tableau[i].push(0);
        html += "<td class="+j+"></td>";
    }
    html += "</tr>";
}
cible.html(html);
//test pour target
$("td").click(function(){
    var test = $(this).attr("class");
    var test2 = $(this).parent().attr("id");
    alert("ligne : "+test2+" colone : "+test)
})
//placement itinitial
//emplacement vide : 0 
//---------------------------------------------COULEUR----------------------------------------
var bleu = 1;
var rouge = 2;
//emplacement accouplement bleu : 3
var accouplement_bleu =  "bleur";
//emplacement accouplement rouge : 4
var accouplement_rouge =  "rouger";     
//emplacement combat : 5
var combat = "fight";

function insert_couleur(couleur){
    if (couleur == 1) {
        return "bleu";
    }else if (couleur == 2) {
        return "rouge";
    }
}



function alea(chiffre){
    return Math.floor(Math.random() * chiffre); 
};

function depart (nb, type, tab = tableau){
    compteur = 0;
    while (compteur < nb) {
        var alea_ligne = alea(ligne);
        var alea_col = alea(col);        
        if (tab[alea_ligne][alea_col] === 0) {
            $("#"+alea_ligne+" > ."+alea_col).attr("couleur", insert_couleur(type));
            tab[alea_ligne][alea_col] = type;
            //console.log("ligne :"+ alea_ligne + " col : " +alea_col);
            compteur++;
        }
    }

}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Nombre de pions -------------------------------------------------------------------------------------------------
depart(8, bleu)
depart(8, rouge)
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function deplacement_calcul(actuel, max){ 
    if (actuel == 0) {
        if (Math.floor(Math.random() * 2 + 1) == 1) {
            //reste sur la position
            return actuel;
        }else{
            //monte d'un cran
            return actuel + 1;
        }
    }else if (actuel == max-1) {
        if (Math.floor(Math.random() * 2 + 1) == 1) {
            //reste sur la position
            return actuel;
        }else{
            //descend d'un cran
            return actuel - 1;
        }
    }else {
        var result = Math.floor(Math.random() * 3 + 1); 
        if (result == 1) {
            //reste sur la position
            return actuel;
        }else if (result == 2) {
            //monte d'un cran
            return actuel + 1;
        }
        else{
            //descend d'un cran
            return actuel - 1;
        }
    }
    
}
function numero_ennemi(num_actuel){
    if (num_actuel == 1) {
        return 2;
    }
    if (num_actuel == 2) {
        return 1;
    }
};
function combatre() {
    return Math.floor(Math.random() * 2 + 1); 
}

function deplacement(tab){
    Array.prototype.clone = function() {
        var newArray = (this instanceof Array) ? [] : {};
        for (i in this) {
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object") {
            newArray[i] = this[i].clone();
        } else newArray[i] = this[i]
        } return newArray;
    }
    var tab_nouveau = tab.clone();    
    for (var i = 0; i < tab.length; i++) {
        for (var j = 0; j < tab[i].length; j++) {
            if (tab[i][j] == 1 || tab[i][j] == 2) {
                console.log("oui")
                var valeur = tab_nouveau[i][j];
                var ennemi = numero_ennemi(valeur);
                var ligne_nouvelle = deplacement_calcul(i, ligne);
                var col_nouvelle = deplacement_calcul(j, col);
                //libere la case actuelle JS
                tab_nouveau[i][j] = 0;
                if (tab_nouveau[ligne_nouvelle][col_nouvelle] == 0) { 
                    //DEPLACEMENT ----------------------
                    //pop sur nouvelle case JS
                    tab_nouveau[ligne_nouvelle][col_nouvelle] = valeur;
                }else if (tab_nouveau[ligne_nouvelle][col_nouvelle] == valeur) {
                    //ACCOUPLEMENT ----------------------
                    if (valeur == 1) {
                        //pop sur nouvelle case JS
                        tab_nouveau[ligne_nouvelle][col_nouvelle] = 3;
                    }else if (valeur == 2) {
                        //pop sur nouvelle case JS
                        tab_nouveau[ligne_nouvelle][col_nouvelle] = 4;
                    }
                }else if (tab_nouveau[ligne_nouvelle][col_nouvelle] == ennemi) {
                    //COMBAT ----------------------
                    //pop sur nouvelle case JS
                    tab_nouveau[ligne_nouvelle][col_nouvelle] = 5;
                }else{
                    //si un combat ou un accouplement a lieu sur la destination, alors reste sur place
                    //pop sur nouvelle case JS
                    tab_nouveau[i][j] = valeur;
                }
            }
            else if (tab[i][j] == 3) {
                tab_nouveau[i][j] = 0;
                compteur = 0;
                while (compteur < 3) {
                    var alea_ligne = alea(ligne);
                    var alea_col = alea(col);        
                    if (tab_nouveau[alea_ligne][alea_col] == 0) {
                        tab_nouveau[alea_ligne][alea_col] = 1;
                        compteur++;
                    }
                }
            }
            else if (tab[i][j] == 4) {
                tab_nouveau[i][j] = 0;                
                compteur = 0;
                while (compteur < 3) {
                    var alea_ligne = alea(ligne);
                    var alea_col = alea(col);        
                    if (tab_nouveau[alea_ligne][alea_col] == 0) {
                        tab_nouveau[alea_ligne][alea_col] = 2;
                        compteur++;
                    }
                }
            }
            else if (tab[i][j] == 5) {
                tab_nouveau[i][j] = combatre();
            }
        }
    }
    console.log(tab_nouveau)
    return tab_nouveau;
}
function affiche_deplacement(tab_nouveau = tableau){
    var compteur1 = 0;
    var compteur2 = 0;
    var toutecase = 0;
    for (var i = 0; i < tab_nouveau.length; i++) {
        for (var j = 0; j < tab_nouveau[i].length; j++) {
            if(tab_nouveau[i][j] == 0) {
                toutecase = 1;
                $("#"+i+" > ."+j).removeAttr("couleur");
            }
            if(tab_nouveau[i][j] == 1) {
                compteur1++;
                $("#"+i+" > ."+j).attr("couleur", insert_couleur(1));
            }
            if(tab_nouveau[i][j] == 2) {
                compteur2++
                $("#"+i+" > ."+j).attr("couleur", insert_couleur(2));
            }
            if(tab_nouveau[i][j] == 3) {
                compteur1++;                
                $("#"+i+" > ."+j).attr("couleur", accouplement_bleu);
            }
            if(tab_nouveau[i][j] == 4) {
                compteur2++                
                $("#"+i+" > ."+j).attr("couleur", accouplement_rouge);
            }
            if(tab_nouveau[i][j] == 5) {
                compteur1++;                
                compteur2++;                                
                $("#"+i+" > ."+j).attr("couleur", combat);
            }
        }
    }
    if(compteur1 == 0) {
        clearInterval(auto);
        alert("Rouge domine");
    }else if(compteur2 == 0) {
        clearInterval(auto);
        alert("Bleu domine");
    }
    else if(toutecase == 0) {
        clearInterval(auto);
        alert("Plus de mouvement possible");
    }
}

    
//console.log(tableau)
//debut de l'automatisation
var auto = setInterval(function () {
    tableau = deplacement(tableau)
    affiche_deplacement()
}, 1000);
