const ll = require('../linkedlist/linkedlist');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .orderBy('id')
  },
  async getLanguageLinkedList(words,head){
    const list = new ll();
    let i =0;
    while (words[i].id !==head){	
      i++;	
    }	
    let currNode = words[i];
    while (currNode.next !== null){
      list.insertLast(currNode);
      i = 0;
      while (words[i].id !==currNode.next){
        i++;
      }
      currNode = words[i];
      i++;
    }
    list.insertLast(currNode);
    return list;
  },
  async updateLanguageWords(db,listOfWords){
    // linked list of words
    let currNode = listOfWords.head;
    let nextId = null
    while(currNode !== null){
      await LanguageService.updateLanguageWord(db,currNode.data);
      currNode = currNode.next;
    }
    return;
  },
  updateLanguageWord(db,word){
    return db
      .from('word')
      .select('*')
      .where({'id':word.id})
      .update(word)
  },
  updateLanguage(db,id,total_score,head){
    return db
      .from('language')
      .select('*')
      .where({id})
      .update({total_score,head})
  }

}

module.exports = LanguageService
