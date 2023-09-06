import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';

const RecipeModal = ({ isOpen, onClose, recipeData, generatedImage }) => {
  const modalRef = useRef(null);
  const [modalContent, setModalContent] = useState(null);

  const handleSaveAsImage = async () => {
    if (!modalRef.current) return;
  
    try {
      const canvas = await html2canvas(modalRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      download(dataUrl, 'recipe_card.png');
    } catch (error) {
      console.error('Error while saving as image:', error);
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recipe Card</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            ref={modalRef}
            className="recipe-card"
            p="4"
            boxShadow="lg"
            bg="white"
          >
            <img
              src={generatedImage}
              alt="Generated Recipe"
              width="100%"
              height="auto"
            />

            <Text fontWeight="bold" mt="2">
              {recipeData.recipeName || 'Recipe Name'}
            </Text>

            <Text fontWeight="bold" mt="2">
              Ingredients
            </Text>
            <ul>
              {recipeData.recipeIngredients
                ? recipeData.recipeIngredients.split('\n').map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))
                : null}
            </ul>

            <Text fontWeight="bold" mt="2">
              Instructions
            </Text>
            <ol>
              {recipeData.recipeDirections
                ? recipeData.recipeDirections.split('\n').map((step, i) => (
                    <li key={i}>{step}</li>
                  ))
                : null}
            </ol>
          </Box>
        </ModalBody>
        <Box textAlign="right" p="4">
          <Button colorScheme="teal" onClick={handleSaveAsImage}>
            Save as Image
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default RecipeModal;