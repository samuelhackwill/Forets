#pour le mode spectateur

#avant le spectacle

il faut flasher la db depuis un client

    FukinScore.remove({})

puis créer un objet wintrigger tout neuf et faux.

    FukinScore.insert({"winTrigger":false})

puis lancer la fonction d'initialisation

    initiateTheShitOutOfThisProgram(...)
        ... = "gauche" si c'est l'ordi de gauche
        ... = "droite" si c'est l'ordi de droite


#pendant le spectacle

l'admin fait défiler le texte jusqu'au moment où c'est aux joueurs d'appuyer sur la barre espace. Ensuite il attend patiemment jusqu'à ce qu'au moins un des deux joueurs soit parvenu à la fin du texte. A ce moment là, il clique sur 

    texteFin

puis

    go to bookmark

puis il fait défiler le texte jusqu'au noir. Alors, il appuie sur les boutons

    scoreG
    scoreD

successivement en priant pour que ça marche

