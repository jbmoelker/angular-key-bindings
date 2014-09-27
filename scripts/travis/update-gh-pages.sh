#!/bin/bash

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then
  echo "Starting to update gh-pages\n"

  #copy data we're interested in to other place
  cp -R dist/docs $HOME/docs
  cp docs/README.md $HOME/docs

  #go to home and setup git
  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"

  #using token clone gh-pages branch
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/jbmoelker/angular-key-bindings.git  gh-pages > /dev/null

  #go into diractory and copy data we're interested in to that directory
  cd gh-pages
  cp -Rf $HOME/docs/* .
  #echo "Travis generated docs" > index.html

  #add, commit and push files
  git add -f .
  git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null

  echo "Done updating gh-pages\n"
else
  echo "Updating gh-pages skipped, because Travis is not notified from master branch."
fi;