// Import all tool SVGs
import React from "react";
import ReactLogo from "@/assets/tools/react.svg";
import NextJsLogo from "@/assets/tools/next-js.svg";
import TypeScriptLogo from "@/assets/tools/typescript.svg";
import AngularLogo from "@/assets/tools/angular.svg";
import VueJsLogo from "@/assets/tools/vue-js.svg";
import TailwindCssLogo from "@/assets/tools/tailwind-css.svg";
import SassLogo from "@/assets/tools/sass.svg";
import WebpackLogo from "@/assets/tools/webpack.svg";
import ThreeJsLogo from "@/assets/tools/three-js.svg";
import NodeJsLogo from "@/assets/tools/node-js.svg";
import PostgreSqlLogo from "@/assets/tools/postgresql.svg";
import MongoDbLogo from "@/assets/tools/mongodb.svg";
import PythonLogo from "@/assets/tools/python.svg";
import GoLogo from "@/assets/tools/go.svg";
import GraphQLLogo from "@/assets/tools/graphql.svg";
import RedisLogo from "@/assets/tools/redis.svg";
import MySQLLogo from "@/assets/tools/mysql.svg";
import ElasticsearchLogo from "@/assets/tools/elasticsearch.svg";
import AndroidLogo from "@/assets/tools/android.svg";
import IosLogo from "@/assets/tools/ios.svg";
import FlutterLogo from "@/assets/tools/flutter.svg";
import ReactNativeLogo from "@/assets/tools/react-native.svg";
import KotlinLogo from "@/assets/tools/kotlin.svg";
import SwiftLogo from "@/assets/tools/swift.svg";
import IonicLogo from "@/assets/tools/ionic.svg";
import DartLogo from "@/assets/tools/dart.svg";
import OpenAILogo from "@/assets/tools/openai.svg";
import TensorFlowLogo from "@/assets/tools/tensorflow.svg";
import PyTorchLogo from "@/assets/tools/pytorch.svg";
import EthereumLogo from "@/assets/tools/ethereum.svg";
import SolidityLogo from "@/assets/tools/solidity.svg";
import SolanaLogo from "@/assets/tools/solana.svg";
import PolygonLogo from "@/assets/tools/polygon.svg";
import LangChainLogo from "@/assets/tools/langchain.svg";
import FigmaLogo from "@/assets/tools/figma.svg";
import AdobeXdLogo from "@/assets/tools/adobe-xd.svg";
import PhotoshopLogo from "@/assets/tools/photoshop.svg";
import IllustratorLogo from "@/assets/tools/illustrator.svg";
import SketchLogo from "@/assets/tools/sketch.svg";
import FramerLogo from "@/assets/tools/framer.svg";
import SplineLogo from "@/assets/tools/spline.svg";
import AwsLogo from "@/assets/tools/aws.svg";
import AzureLogo from "@/assets/tools/azure.svg";
import GoogleCloudLogo from "@/assets/tools/google-cloud.svg";
import DockerLogo from "@/assets/tools/docker.svg";
import KubernetesLogo from "@/assets/tools/kubernetes.svg";
import TerraformLogo from "@/assets/tools/terraform.svg";
import JenkinsLogo from "@/assets/tools/jenkins.svg";
import GithubActionsLogo from "@/assets/tools/github-actions.svg";
import KaliLinuxLogo from "@/assets/tools/kali-linux.svg";
import WiresharkLogo from "@/assets/tools/wireshark.svg";
import MetasploitLogo from "@/assets/tools/metasploit.svg";
import BurpSuiteLogo from "@/assets/tools/burp-suite.svg";
import HashiCorpVaultLogo from "@/assets/tools/hashicorp-vault.svg";
import SnykLogo from "@/assets/tools/snyk.svg";
import ShopifyLogo from "@/assets/tools/shopify.svg";
import WooCommerceLogo from "@/assets/tools/woocommerce.svg";
import SalesforceLogo from "@/assets/tools/salesforce.svg";
import WordPressLogo from "@/assets/tools/wordpress.svg";
import SapLogo from "@/assets/tools/sap.svg";
import MagentoLogo from "@/assets/tools/magento.svg";
import OdooLogo from "@/assets/tools/odoo.svg";
import StrapiLogo from "@/assets/tools/strapi.svg";

export interface TechItem {
  name: string;
  logo: string;
  category: string;
}

export const technologies: TechItem[] = [
  // Web & Frontend
  { name: "React", category: "web", logo: ReactLogo },
  { name: "Next.js", category: "web", logo: NextJsLogo },
  { name: "TypeScript", category: "web", logo: TypeScriptLogo },
  { name: "Angular", category: "web", logo: AngularLogo },
  { name: "Vue.js", category: "web", logo: VueJsLogo },
  { name: "Tailwind CSS", category: "web", logo: TailwindCssLogo },
  { name: "SASS", category: "web", logo: SassLogo },
  { name: "Webpack", category: "web", logo: WebpackLogo },
  { name: "Three.js", category: "web", logo: ThreeJsLogo },

  // Backend & DB
  { name: "Node.js", category: "backend", logo: NodeJsLogo },
  { name: "PostgreSQL", category: "backend", logo: PostgreSqlLogo },
  { name: "MongoDB", category: "backend", logo: MongoDbLogo },
  { name: "Python", category: "backend", logo: PythonLogo },
  { name: "Go", category: "backend", logo: GoLogo },
  { name: "GraphQL", category: "backend", logo: GraphQLLogo },
  { name: "Redis", category: "backend", logo: RedisLogo },
  { name: "MySQL", category: "backend", logo: MySQLLogo },
  { name: "Elasticsearch", category: "backend", logo: ElasticsearchLogo },

  // Mobility
  { name: "Android", category: "mobility", logo: AndroidLogo },
  { name: "iOS", category: "mobility", logo: IosLogo },
  { name: "Flutter", category: "mobility", logo: FlutterLogo },
  { name: "React Native", category: "mobility", logo: ReactNativeLogo },
  { name: "Kotlin", category: "mobility", logo: KotlinLogo },
  { name: "Swift", category: "mobility", logo: SwiftLogo },
  { name: "Ionic", category: "mobility", logo: IonicLogo },
  { name: "Dart", category: "mobility", logo: DartLogo },

  // AI & Web3
  { name: "OpenAI", category: "ai_block", logo: OpenAILogo },
  { name: "TensorFlow", category: "ai_block", logo: TensorFlowLogo },
  { name: "PyTorch", category: "ai_block", logo: PyTorchLogo },
  { name: "Ethereum", category: "ai_block", logo: EthereumLogo },
  { name: "Solidity", category: "ai_block", logo: SolidityLogo },
  { name: "Solana", category: "ai_block", logo: SolanaLogo },
  { name: "Polygon", category: "ai_block", logo: PolygonLogo },
  { name: "LangChain", category: "ai_block", logo: LangChainLogo },

  // Design
  { name: "Figma", category: "design", logo: FigmaLogo },
  { name: "Adobe XD", category: "design", logo: AdobeXdLogo },
  { name: "Photoshop", category: "design", logo: PhotoshopLogo },
  { name: "Illustrator", category: "design", logo: IllustratorLogo },
  { name: "Sketch", category: "design", logo: SketchLogo },
  { name: "Framer", category: "design", logo: FramerLogo },
  { name: "Spline", category: "design", logo: SplineLogo },

  // Cloud & DevOps
  { name: "AWS", category: "cloud_devops", logo: AwsLogo },
  { name: "Azure", category: "cloud_devops", logo: AzureLogo },
  { name: "Google Cloud", category: "cloud_devops", logo: GoogleCloudLogo },
  { name: "Docker", category: "cloud_devops", logo: DockerLogo },
  { name: "Kubernetes", category: "cloud_devops", logo: KubernetesLogo },
  { name: "Terraform", category: "cloud_devops", logo: TerraformLogo },
  { name: "Jenkins", category: "cloud_devops", logo: JenkinsLogo },
  { name: "GitHub Actions", category: "cloud_devops", logo: GithubActionsLogo },

  // Security
  { name: "Kali Linux", category: "security", logo: KaliLinuxLogo },
  { name: "Wireshark", category: "security", logo: WiresharkLogo },
  { name: "Metasploit", category: "security", logo: MetasploitLogo },
  { name: "Burp Suite", category: "security", logo: BurpSuiteLogo },
  { name: "HashiCorp Vault", category: "security", logo: HashiCorpVaultLogo },
  { name: "Snyk", category: "security", logo: SnykLogo },

  // Enterprise & E-com
  { name: "Shopify", category: "enterprise", logo: ShopifyLogo },
  { name: "WooCommerce", category: "enterprise", logo: WooCommerceLogo },
  { name: "Salesforce", category: "enterprise", logo: SalesforceLogo },
  { name: "WordPress", category: "enterprise", logo: WordPressLogo },
  { name: "SAP", category: "enterprise", logo: SapLogo },
  { name: "Magento", category: "enterprise", logo: MagentoLogo },
  { name: "Odoo", category: "enterprise", logo: OdooLogo },
  { name: "Strapi", category: "enterprise", logo: StrapiLogo },
];
