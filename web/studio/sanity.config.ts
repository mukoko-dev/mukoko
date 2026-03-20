import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {mukokoTheme} from './theme'
import {structure} from './structure'
import {Logo, Icon} from './components/Logo'

export default defineConfig({
  name: 'mukoko',
  title: 'mukoko',
  icon: Icon,

  projectId: 'npzanja1',
  dataset: 'production',

  theme: mukokoTheme,

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      logo: Logo,
    },
  },
})
