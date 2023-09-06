import React, { useState } from 'react';
import { ChakraProvider, Box, Text, Input, Textarea, Button, Center } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import RecipeModal from '../components/RecipeModal';

export default function Home() {
    const { isOpen, onOpen, onClose } = useDisclosure();
  const [generatedImage, setGeneratedImage] = useState(null); // Store the generated image URL
  const [recipeData, setRecipeData] = useState({
    recipeName: '',
    recipeIngredients: '',
    recipeDirections: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };

  const checkInferenceStatus = async (inferenceId) => {
    const modelId = '26a1a203-3a46-42cb-8cfa-f4de075907d8'; // Your model ID

    const apiUrl = `https://api.tryleap.ai/api/v1/images/models/${modelId}/inferences/${inferenceId}`;
    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': 'Bearer YOUR_API_KEY', // Your API key
      },
    };

    try {
      let status = 'queued';
      while (status === 'queued') {
        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        status = responseData.status; // Get the status from the response

        if (status === 'finished') {
          const generatedImageUrl = responseData.images[0].uri;
          console.log('Generated Image URI:', generatedImageUrl);
          setGeneratedImage(generatedImageUrl);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log('Inference completed with status:', status);
    } catch (error) {
      console.error('Error while checking inference status:', error);
      setGeneratedImage(null);
    }
  };

  const handleGenerateAIImage = async () => {
    const modelId = '26a1a203-3a46-42cb-8cfa-f4de075907d8'; // basic model ID
    const apiUrl = `https://api.tryleap.ai/api/v1/images/models/${modelId}/inferences`;
    const prompt = `Generate a tasty looking food image using the ingredients and recipe information: 
      Recipe Name: ${recipeData.recipeName}
      Recipe Ingredients: ${recipeData.recipeIngredients}
      Recipe Directions: ${recipeData.recipeDirections}`;

    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': 'Bearer YOUR_API_KEY', // Your API key
      },
      body: JSON.stringify({ prompt }),
    };

    try {
      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      const inferenceId = responseData.id;

      checkInferenceStatus(inferenceId);
    } catch (error) {
      console.error('Error while generating AI image:', error);
      setGeneratedImage(null);
    }
  };

  return (
    <ChakraProvider>
      <Box display="flex" justifyContent="center">
        <Box maxW="800px">
          <Text fontSize="xxx-large" fontWeight="extrabold" textAlign="center" marginTop="9">
            AI Recipe Card Maker
          </Text>

          {/* Recipe Input Form */}
          <form>
            <Input
              type="text"
              name="recipeName"
              placeholder="Recipe Name"
              value={recipeData.recipeName}
              onChange={handleInputChange}
              mb="4"
            />

            <Textarea
              name="recipeIngredients"
              placeholder="Recipe Ingredients (one per line)"
              value={recipeData.recipeIngredients}
              onChange={handleInputChange}
              mb="4"
            />

            <Textarea
              name="recipeDirections"
              placeholder="Recipe Directions (one per line)"
              value={recipeData.recipeDirections}
              onChange={handleInputChange}
              mb="4"
            />

            <Button onClick={handleGenerateAIImage} colorScheme="blue">
              Generate AI Image
            </Button>
          </form>

          {/* Display the generated image and open modal */}
          {generatedImage && (
            <Center mt="4">
              <Button onClick={onOpen} colorScheme="teal">
                View Recipe Card
              </Button>
            </Center>
          )}

          {/* Render the RecipeModal */}
          <RecipeModal isOpen={isOpen} onClose={onClose} recipeData={recipeData} generatedImage={generatedImage} />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
