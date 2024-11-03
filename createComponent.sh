#!/bin/bash

# Vérifier si le nom du composant est fourni en argument
if [ -z "$1" ]; then
  echo "Veuillez fournir un nom de composant."
  exit 1
fi

# Nom du composant  sans espaces
component_name=$(echo "$1" | tr -d ' ')

# Vérifier si le dossier du composant existe déjà
if [ -d "src/components/$component_name" ]; then
  echo "Le composant '$component_name' existe déjà."
  exit 1
fi

# Créer le dossier du composant
mkdir "src/components/$component_name"

# Chemin des fichiers du composant
index_file="src/components/$component_name/index.tsx"
component_file="src/components/$component_name/$component_name.tsx"
style_file="src/components/$component_name/style.scss"
styleMobile_file="src/components/$component_name/style-mobile.scss"
type_file="src/components/$component_name/$component_name.types.ts"

# Créer le contenu du fichier index.tsx
echo "export { default } from './$component_name';" > "$index_file"

# Créer le contenu du fichier NomDuComposant.tsx
echo "import './style.scss';
import './style-mobile.scss';

import React, { FC, useState, useEffect } from 'react';
import { ${component_name}Props } from './${component_name}.types';

const $component_name: FC<${component_name}Props> = () => {
  return (
    <div className=\"$component_name\">
      $component_name
    </div>
  );
}

export default $component_name;" > "$component_file"

# Créer le contenu du fichier style.scss
echo ".$component_name {
  /* Ajoutez vos styles ici */
}" > "$style_file"

# Créer le contenu du fichier style-mobile.scss
echo "
@media (max-width: 768px) {
  .$component_name {
    /* Ajoutez vos styles ici */
  }
}" > "$styleMobile_file"

# Créer le contenu du fichier types.ts
echo "export interface ${component_name}Props {
  /* Ajoutez vos styles ici */
}" > "$type_file"

# ### Ajout d'un fichier de test unitaire

# Créer le fichier de test
echo "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import $component_name from './$component_name';

describe('$component_name', () => {
  it('should render the component correctly', () => {
    render(<$component_name />);

    expect(screen.getByText('$component_name')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});" > "src/components/$component_name/$component_name.test.tsx"

echo "Le composant '$component_name' a été créé avec succès."
