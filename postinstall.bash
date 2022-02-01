if [[ \"$CI\" != 'true' ]] && [[ \"$INIT_CWD\" != *'node_modules/lit-ntml' ]] && [[ \"$INIT_CWD\" == *'lit-ntml' ]]
then
  simple-git-hooks && npm dedupe
fi
