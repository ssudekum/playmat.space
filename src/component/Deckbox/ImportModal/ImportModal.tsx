import React, { FC, useState } from 'react'
import './ImportModal.css'
import { Modal, ModalProps } from '../../Modal/Modal'
import CountedCollection from '../../../lib/CountedCollection'
import Card from '../../../lib/Card'

type ImportModalProps = ModalProps & {
  onImport: (cards: CountedCollection<Card>) => void
};

export const ImportModal: FC<ImportModalProps> = ({ visible, setVisible, onImport }) => {
  const [isLoading, setIsLoading] = useState(false);

  const doImport = () => {
    const inputElem: HTMLTextAreaElement | null = document.querySelector('textarea[id=importData]')
    if (inputElem) {
      setIsLoading(true)
      const text = inputElem?.value
      const lines = text.split("\n")
      const counts: Record<string, number> = {};

      let namesToProcess: Object[] = []
      let promises: Promise<any>[] = []
      for (let i = 0; i < lines.length; i++) {
        var line = lines[i]
        let count = parseInt(line.substring(0, line.indexOf(' ')))
        let name = line.substring(line.indexOf(' ') + 1)
        counts[name] = count
        namesToProcess.push({ "name": name })

        // max request number for collection api is 75 items
        if (namesToProcess.length === 75) {
          promises.push(fetchCardsByName(namesToProcess))
          namesToProcess = [];
        }
      }

      if (namesToProcess.length !== 0) {
        promises.push(fetchCardsByName(namesToProcess))
        namesToProcess = [];
      }

      Promise.all(promises).then((results) => {
        let totalCardResults = new CountedCollection<Card>()
        for (let j = 0; j < results.length; j++) {
          let cardResults: Card[] = results[j]
          for (let k = 0; k < cardResults.length; k++) {
            let card = cardResults[k]
            totalCardResults.add(card, counts[card.name])
          }
        }

        onImport(totalCardResults)
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        setVisible(false)
        setIsLoading(false)
      });
    }
  }

  const fetchCardsByName: (names: Object[]) => Promise<Card[] | undefined> = async (names: Object[]) => {
    try {
      const response = await fetch(`https://api.scryfall.com/cards/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ "identifiers": names })
      })

      return response.json().then(function (res) {
        return res.data
      })
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Modal id="importModal" visible={visible} setVisible={setVisible}>
      <textarea id="importData" />
      <button 
        id="importButton"
        className="button"
        onClick={doImport}
        disabled={isLoading}>
        {isLoading ? <>
          <i className="fa fa-spinner fa-spin" /> Working
        </>: 'Import'}
      </button>
    </Modal>
  );
}

export default ImportModal